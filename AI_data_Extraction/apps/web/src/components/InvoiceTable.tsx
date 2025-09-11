import React from 'react';
import { Invoice } from '@repo/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import Link from 'next/link';

interface InvoiceTableProps {
  invoices: Invoice[];
  onEdit: (invoiceId: string) => void;
  onDelete: (invoiceId: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead>Invoice Number</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Extracted At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">No invoices found.</TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell>{invoice.fileName}</TableCell>
              <TableCell>{invoice.vendor?.name}</TableCell>
              <TableCell>{invoice.invoiceInfo?.number}</TableCell>
              <TableCell>{invoice.invoiceInfo?.totalAmount} {invoice.invoiceInfo?.currency}</TableCell>
              <TableCell>{new Date(invoice.extractedAt).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Link href={`/invoices/${invoice._id}`} passHref>
                  <Button variant="outline" size="sm">View/Edit</Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => onDelete(invoice._id!)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;

