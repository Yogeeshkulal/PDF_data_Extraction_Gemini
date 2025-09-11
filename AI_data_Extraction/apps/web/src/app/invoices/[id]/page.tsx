'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Invoice } from '@repo/types';
import { getInvoiceById, updateInvoice, deleteInvoice, createInvoice } from '@/lib/api';
import InvoiceForm from '@/components/InvoiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoiceDetailsPageProps {
  params: { id: string };
}

export default function InvoiceDetailsPage({ params }: InvoiceDetailsPageProps) {
  const { id } = params;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchInvoice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInvoiceById(id);
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id, fetchInvoice]);

  const handleSave = useCallback(async (updatedInvoice: Invoice) => {
    setLoading(true);
    setError(null);
    try {
      await updateInvoice(id, updatedInvoice);
      alert('Invoice updated successfully!');
      router.push('/invoices'); // Redirect to list page after update
    } catch (err: any) {
      setError(err.message || 'Failed to update invoice.');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const handleExtract = useCallback(async (fileId: string, model: 'gemini' | 'groq') => {
    // This page is for existing invoices, extraction is typically done on initial upload.
    // However, if the user explicitly triggers it, we can re-extract.
    setLoading(true);
    setError(null);
    try {
      const response = await createInvoice({ fileId, /* other invoice details if any */ }); // Use createInvoice for re-extraction creating a new one.
      setInvoice(response); // Update current invoice with new extracted data
      alert('Invoice re-extracted and updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to re-extract invoice.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteInvoice(invoiceId);
      alert('Invoice deleted successfully!');
      router.push('/invoices'); // Redirect to list page after deletion
    } catch (err: any) {
      setError(err.message || 'Failed to delete invoice.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p>Loading invoice details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!invoice) return <p>Invoice not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            invoice={invoice}
            onSave={handleSave}
            onExtract={handleExtract}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}

