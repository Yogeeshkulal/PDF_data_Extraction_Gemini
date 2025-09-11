'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Invoice, GetInvoicesQuery } from '@repo/types';
import { getInvoices, deleteInvoice } from '@/lib/api';
import InvoiceTable from '@/components/InvoiceTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchVendor, setSearchVendor] = useState<string>('');
  const [searchInvoiceNumber, setSearchInvoiceNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: GetInvoicesQuery = {};
      if (searchVendor) query.vendorName = searchVendor;
      if (searchInvoiceNumber) query.invoiceNumber = searchInvoiceNumber;
      const data = await getInvoices(query);
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices.');
    } finally {
      setLoading(false);
    }
  }, [searchVendor, searchInvoiceNumber]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
  };

  const handleEdit = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`);
  };

  const handleDelete = useCallback(async (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setLoading(true);
      setError(null);
      try {
        await deleteInvoice(invoiceId);
        alert('Invoice deleted successfully!');
        fetchInvoices(); // Refresh the list
      } catch (err: any) {
        setError(err.message || 'Failed to delete invoice.');
      } finally {
        setLoading(false);
      }
    }
  }, [fetchInvoices]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          <Link href="/">
            <Button>Upload New PDF</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Search by Vendor Name"
              value={searchVendor}
              onChange={(e) => setSearchVendor(e.target.value)}
              className="flex-grow"
            />
            <Input
              placeholder="Search by Invoice Number"
              value={searchInvoiceNumber}
              onChange={(e) => setSearchInvoiceNumber(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>Search</Button>
          </form>
          {error && <p className="text-red-500 mb-4">Error: {error}</p>}
          {loading ? (
            <p>Loading invoices...</p>
          ) : (
            <InvoiceTable invoices={invoices} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

