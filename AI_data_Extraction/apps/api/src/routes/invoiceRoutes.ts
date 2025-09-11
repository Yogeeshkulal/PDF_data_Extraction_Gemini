import { Router, Request, Response } from 'express';
import multer from 'multer';
import { GridFSBucket, ObjectId } from 'mongodb';
import { validationResult } from 'express-validator';
import { getBucket } from '../config/db';
import { extractInvoiceData } from '../services/aiService';
import InvoiceModel from '../models/Invoice';
import { FileUploadResponse, ExtractInvoicePayload, ExtractInvoiceResponse, Invoice, GetInvoicesQuery } from '@repo/types';
import { validateExtractInvoice, validateGetInvoices, validateInvoiceId, validateUpdateInvoice } from '../utils/validation';
import express from 'express';

const router = Router();

// Middleware to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: () => void) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB limit
});

// POST /upload
router.post('/upload', upload.single('file'), async (req: Request, res: Response<FileUploadResponse | { message: string }>) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const bucket = getBucket();
  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    metadata: { mimetype: req.file.mimetype },
  });

  uploadStream.end(req.file.buffer);

  uploadStream.on('finish', () => {
    const response: FileUploadResponse = {
      fileId: uploadStream.id.toString(),
      fileName: req.file!.originalname,
    };
    res.status(201).json(response);
  });

  uploadStream.on('error', (err: Error) => {
    console.error('Error uploading file to GridFS:', err);
    res.status(500).json({ message: 'File upload failed' });
  });
});

interface ExtractRequestPayload extends ExtractInvoicePayload {
  extractedText: string;
}

// POST /extract
router.post('/extract', express.json(), validateExtractInvoice, handleValidationErrors, async (req: Request<{}, ExtractInvoiceResponse | { success: boolean; error: string; details: string }, ExtractRequestPayload>, res: Response<ExtractInvoiceResponse | { success: boolean; error: string; details: string }>) => {
  const { fileId, model, extractedText } = req.body;

  try {
    // Extract structured data using AI service
    const extractionResult = await extractInvoiceData(extractedText, model);

    if ('error' in extractionResult) {
      return res.status(500).json({ success: false, error: extractionResult.error, details: extractionResult.details });
    }

    // Get file details from GridFS
    const bucket = getBucket();
    const _id = new ObjectId(fileId);
    const file = await bucket.find({ _id: _id }).toArray();
    if (file.length === 0) {
      return res.status(404).json({ success: false, error: 'File not found', details: 'PDF file not found in GridFS for extraction.' });
    }
    const fileName = file[0].filename;

    const newInvoice: Invoice = {
      fileId: fileId,
      fileName: fileName,
      vendor: extractionResult.vendor,
      invoiceInfo: extractionResult.invoiceInfo,
      lineItems: extractionResult.lineItems,
      extractedAt: new Date(),
      lastUpdatedAt: new Date(),
    };

    const createdInvoice = await InvoiceModel.create(newInvoice);

    const response: ExtractInvoiceResponse = {
      invoice: createdInvoice,
    };
    res.status(200).json({ success: true, ...response });
  } catch (error: any) {
    console.error('Error during extraction or saving invoice:', error);
    res.status(500).json({ success: false, error: 'Server error', details: error.message || 'An unexpected error occurred.' });
  }
});

// POST / - create new invoice
router.post('/', express.json(), validateExtractInvoice, handleValidationErrors, async (req: Request<{}, Invoice | { message: string }, Partial<Invoice>>, res: Response<Invoice | { message: string }>) => {
  try {
    const newInvoice = await InvoiceModel.create(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Failed to create invoice' });
  }
});

// GET /invoices - list all invoices (+ search by vendor.name or invoice.number)
router.get('/', validateGetInvoices, handleValidationErrors, async (req: Request<{}, Invoice[], {}, GetInvoicesQuery>, res: Response<Invoice[] | { message: string }>) => {
  const { vendorName, invoiceNumber } = req.query;
  const filter: any = {};

  if (vendorName) {
    filter['vendor.name'] = { $regex: vendorName, $options: 'i' };
  }
  if (invoiceNumber) {
    filter['invoiceInfo.number'] = { $regex: invoiceNumber, $options: 'i' };
  }

  try {
    const invoices = await InvoiceModel.find(filter);
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
});

// GET /invoices/:id - get invoice by ID
router.get('/:id', validateInvoiceId, handleValidationErrors, async (req: Request<{ id: string }>, res: Response<Invoice | { message: string }>) => {
  try {
    const invoice = await InvoiceModel.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice by ID:', error);
    res.status(500).json({ message: 'Failed to fetch invoice' });
  }
});

// PUT /invoices/:id - update invoice
router.put('/:id', express.json(), validateUpdateInvoice, handleValidationErrors, async (req: Request<{ id: string }, Invoice | { message: string }, Partial<Invoice>>, res: Response<Invoice | { message: string }>) => {
  try {
    // Exclude _id, fileId, fileName, extractedAt, lastUpdatedAt from direct update
    const updates = { ...req.body };
    delete updates._id;
    delete updates.fileId;
    delete updates.fileName;
    delete updates.extractedAt;
    updates.lastUpdatedAt = new Date();

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Failed to update invoice' });
  }
});

// DELETE /invoices/:id - delete invoice
router.delete('/:id', validateInvoiceId, handleValidationErrors, async (req: Request<{ id: string }>, res: Response<{ message: string }>) => {
  try {
    const invoiceToDelete = await InvoiceModel.findById(req.params.id);
    if (!invoiceToDelete) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Delete the associated PDF from GridFS
    const bucket = getBucket();
    await bucket.delete(new ObjectId(invoiceToDelete.fileId));

    await InvoiceModel.findByIdAndDelete(req.params.id);
    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Failed to delete invoice' });
  }
});

export default router;
