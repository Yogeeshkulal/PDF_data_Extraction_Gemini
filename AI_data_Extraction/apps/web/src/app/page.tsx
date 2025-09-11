'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
// import PdfViewer from '@/components/PdfViewer'; // Removed direct import
import InvoiceForm from '@/components/InvoiceForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Invoice, FileUploadResponse } from '@repo/types';
import { uploadPdf, extractInvoice, createInvoice, updateInvoice, deleteInvoice, parsePdf } from '@/lib/api';
import { Loader2 } from "lucide-react";

// const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false }); // Removed PdfViewer dynamic import

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [pdfUrl, setPdfUrl] = useState<string>(''); // Removed pdfUrl state
  const [currentFileId, setCurrentFileId] = useState<string | undefined>(undefined);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [extractedPdfText, setExtractedPdfText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // setPdfUrl(URL.createObjectURL(file)); // Removed pdfUrl update
      setCurrentInvoice(null); // Clear invoice when new PDF is selected
      setCurrentFileId(undefined);
      setExtractedPdfText(''); // Clear extracted text
      setError(null);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a PDF file to upload.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Upload PDF to GridFS
      const uploadResponse: FileUploadResponse = await uploadPdf(selectedFile);
      setCurrentFileId(uploadResponse.fileId);
      
      // Parse PDF text
      const parseResponse = await parsePdf(selectedFile);
      if (!parseResponse.success) {
        setError(parseResponse.details || parseResponse.error || 'Failed to parse PDF.');
        setExtractedPdfText(''); // Clear any previous text
        setLoading(false);
        return;
      }
      setExtractedPdfText(parseResponse.text);

      alert('PDF uploaded and parsed successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to upload or parse PDF.');
    } finally {
      setLoading(false);
    }
  }, [selectedFile]);

  const handleExtract = useCallback(async (fileId: string, model: 'gemini' | 'groq') => {
    setLoading(true);
    setError(null);
    try {
      if (!extractedPdfText) {
        setError('No extracted PDF text available. Please upload and parse a PDF first.');
        setLoading(false);
        return;
      }
      const response = await extractInvoice({ fileId, model, extractedText: extractedPdfText });
      
      if ('success' in response && !response.success) {
        setError(response.details || response.error || 'Gemini extraction failed');
      } else if ('invoice' in response) {
        setCurrentInvoice(response.invoice);
        alert('Invoice extracted successfully!');
      } else {
        setError('Unexpected response from AI extraction.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to extract invoice.');
    } finally {
      setLoading(false);
    }
  }, [extractedPdfText]);

  const handleSaveInvoice = useCallback(async (invoice: Invoice) => {
    setLoading(true);
    setError(null);
    try {
      if (invoice._id) {
        await updateInvoice(invoice._id, invoice);
        alert('Invoice updated successfully!');
      } else {
        await createInvoice(invoice);
        alert('Invoice created successfully!');
      }
      setCurrentInvoice(invoice); // Update local state with saved invoice (including _id if new)
    } catch (err: any) {
      setError(err.message || 'Failed to save invoice.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteInvoice = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteInvoice(invoiceId);
      alert('Invoice deleted successfully!');
      // setPdfUrl(''); // Clear PDF viewer - removed
      setCurrentFileId(undefined);
      setCurrentInvoice(null); // Clear form
      setExtractedPdfText(''); // Clear extracted text
    } catch (err: any) {
      setError(err.message || 'Failed to delete invoice.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="flex h-screen flex-col lg:flex-row">
      {/* Left Panel: PDF Viewer */}
      <div className="w-full lg:w-1/2 p-4 border-r overflow-hidden">
        <div className="flex flex-col space-y-4 mb-4">
          <Input type="file" accept="application/pdf" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!selectedFile || loading}>
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading & Parsing...</>
            ) : (
              'Upload & Parse PDF'
            )}
          </Button>
        </div>
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        <div className="h-[calc(100vh-160px)] p-4 border rounded-md bg-gray-50 overflow-auto text-sm text-gray-800">
          {extractedPdfText ? (
            <pre className="whitespace-pre-wrap">Extracted Text:\n{extractedPdfText}</pre>
          ) : (
            <p className="text-gray-500">Upload a PDF to extract text.</p>
          )}
        </div>
      </div>

      {/* Right Panel: Invoice Form */}
      <div className="w-full lg:w-1/2 p-4 overflow-auto">
        <InvoiceForm
          invoice={currentInvoice}
          onSave={handleSaveInvoice}
          onExtract={handleExtract}
          onDelete={handleDeleteInvoice}
          fileId={currentFileId}
          extractedText={extractedPdfText}
        />
      </div>
    </main>
  );
}
