import { body, query, param } from 'express-validator';

export const validateExtractInvoice = [
  body('fileId').isMongoId().withMessage('Invalid fileId format'),
  body('model').isIn(['gemini', 'groq']).withMessage(`Model must be 'gemini' or 'groq'`),
];

export const validateGetInvoices = [
  query('vendorName').optional().isString().trim().escape(),
  query('invoiceNumber').optional().isString().trim().escape(),
];

export const validateInvoiceId = [
  param('id').isMongoId().withMessage('Invalid Invoice ID format'),
];

export const validateUpdateInvoice = [
  param('id').isMongoId().withMessage('Invalid Invoice ID format'),
  body('vendor.name').optional().isString().trim().escape(),
  body('vendor.address').optional().isString().trim().escape(),
  body('vendor.taxId').optional().isString().trim().escape(),
  body('invoiceInfo.number').optional().isString().trim().escape(),
  body('invoiceInfo.date').optional().isISO8601().toDate().withMessage('Invalid date format (YYYY-MM-DD)'),
  body('invoiceInfo.dueDate').optional().isISO8601().toDate().withMessage('Invalid date format (YYYY-MM-DD)'),
  body('invoiceInfo.totalAmount').optional().isFloat({ gt: 0 }).withMessage('Total amount must be a positive number'),
  body('invoiceInfo.currency').optional().isString().trim().escape(),
  body('lineItems').optional().isArray().withMessage('Line items must be an array'),
  body('lineItems.*.description').optional().isString().trim().escape(),
  body('lineItems.*.quantity').optional().isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
  body('lineItems.*.unitPrice').optional().isFloat({ gt: 0 }).withMessage('Unit price must be a positive number'),
  body('lineItems.*.total').optional().isFloat({ gt: 0 }).withMessage('Total for line item must be a positive number'),
];

