import { Router, Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
// @ts-ignore
import pdf from "pdf-parse";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB limit
});

interface PdfParseResponse {
  text?: string;
  success: boolean;
  error?: string;
  details?: string;
}

// POST /parse-pdf
router.post('/parse-pdf', upload.single('file'), async (req: Request, res: Response<PdfParseResponse | { message: string }>) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const data = await pdfParse(req.file.buffer);
    res.status(200).json({ success: true, text: data.text });
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ success: false, error: 'Failed to parse PDF', details: error.message || 'An unknown error occurred during PDF parsing.' });
  }
});

export default router;

