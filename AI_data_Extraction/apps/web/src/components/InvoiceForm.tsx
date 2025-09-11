import React, { useState, useEffect } from 'react';
import { Invoice, LineItem, InvoiceInfo, VendorInfo } from '@repo/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';

interface InvoiceFormProps {
  invoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
  onExtract: (fileId: string, model: 'gemini' | 'groq') => void;
  onDelete: (invoiceId: string) => void;
  fileId?: string; // Optional: when uploading a new PDF and not yet an invoice
  extractedText?: string; // New prop for extracted PDF text
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onSave,
  onExtract,
  onDelete,
  fileId: propFileId,
  extractedText,
}) => {
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
    vendor: { name: '', address: '' },
    invoiceInfo: { number: '', date: '', dueDate: '', totalAmount: 0, currency: 'USD' },
    lineItems: [],
  });

  useEffect(() => {
    if (invoice) {
      setCurrentInvoice(invoice);
    } else if (propFileId) {
      setCurrentInvoice((prev) => ({ ...prev, fileId: propFileId }));
    }
  }, [invoice, propFileId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [field, subField] = name.split('.');

    if (field === 'vendor' || field === 'invoiceInfo') {
      setCurrentInvoice((prev) => ({
        ...prev,
        [field]: { ...((prev as any)[field] || {}), [subField]: value },
      }));
    } else {
      setCurrentInvoice((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLineItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedLineItems = [...(currentInvoice.lineItems || [])];
    const item = updatedLineItems[index];

    if (item) {
      (item as any)[name] = name === 'description' ? value : parseFloat(value);
      item.total = item.quantity * item.unitPrice;
    }

    setCurrentInvoice((prev) => ({ ...prev, lineItems: updatedLineItems }));
  };

  const addLineItem = () => {
    setCurrentInvoice((prev) => ({
      ...prev,
      lineItems: [
        ...(prev.lineItems || []),
        { description: '', quantity: 0, unitPrice: 0, total: 0 },
      ],
    }));
  };

  const removeLineItem = (index: number) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      lineItems: (prev.lineItems || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInvoice._id) {
      // This is an existing invoice, so save (update)
      onSave(currentInvoice as Invoice);
    } else if (currentInvoice.fileId) {
      // This is a new invoice extracted from a file, so save (create)
      onSave(currentInvoice as Invoice);
    } else {
      console.error("Cannot save: No invoice data or fileId available.");
    }
  };

  const handleExtractClick = () => {
    if (currentInvoice.fileId) {
      onExtract(currentInvoice.fileId, 'gemini'); // Default to Gemini for now
    } else {
      alert("Please upload a PDF first.");
    }
  };

  const handleDeleteClick = () => {
    if (currentInvoice._id && confirm('Are you sure you want to delete this invoice?')) {
      onDelete(currentInvoice._id);
    }
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle>{invoice ? 'Edit Invoice' : 'New Invoice'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {extractedText && (
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Extracted Raw Text</h3>
              <Textarea
                value={extractedText}
                readOnly
                rows={10}
                className="font-mono text-xs"
              />
            </div>
          )}

          {/* Vendor Info */}
          <h3 className="text-lg font-semibold">Vendor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor.name">Vendor Name</Label>
              <Input
                id="vendor.name"
                name="vendor.name"
                value={currentInvoice.vendor?.name || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="vendor.address">Address</Label>
              <Input
                id="vendor.address"
                name="vendor.address"
                value={currentInvoice.vendor?.address || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="vendor.taxId">Tax ID</Label>
              <Input
                id="vendor.taxId"
                name="vendor.taxId"
                value={currentInvoice.vendor?.taxId || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Invoice Info */}
          <h3 className="text-lg font-semibold">Invoice Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceInfo.number">Invoice Number</Label>
              <Input
                id="invoiceInfo.number"
                name="invoiceInfo.number"
                value={currentInvoice.invoiceInfo?.number || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="invoiceInfo.date">Date</Label>
              <Input
                id="invoiceInfo.date"
                name="invoiceInfo.date"
                type="date"
                value={currentInvoice.invoiceInfo?.date || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="invoiceInfo.dueDate">Due Date</Label>
              <Input
                id="invoiceInfo.dueDate"
                name="invoiceInfo.dueDate"
                type="date"
                value={currentInvoice.invoiceInfo?.dueDate || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="invoiceInfo.totalAmount">Total Amount</Label>
              <Input
                id="invoiceInfo.totalAmount"
                name="invoiceInfo.totalAmount"
                type="number"
                step="0.01"
                value={currentInvoice.invoiceInfo?.totalAmount || 0}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="invoiceInfo.currency">Currency</Label>
              <Input
                id="invoiceInfo.currency"
                name="invoiceInfo.currency"
                value={currentInvoice.invoiceInfo?.currency || 'USD'}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Line Items */}
          <h3 className="text-lg font-semibold">Line Items</h3>
          <div className="space-y-2">
            {(currentInvoice.lineItems || []).map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor={`lineItems.${index}.description`}>Description</Label>
                    <Input
                      id={`lineItems.${index}.description`}
                      name="description"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(index, e)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lineItems.${index}.quantity`}>Quantity</Label>
                    <Input
                      id={`lineItems.${index}.quantity`}
                      name="quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, e)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lineItems.${index}.unitPrice`}>Unit Price</Label>
                    <Input
                      id={`lineItems.${index}.unitPrice`}
                      name="unitPrice"
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleLineItemChange(index, e)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lineItems.${index}.total`}>Total</Label>
                    <Input
                      id={`lineItems.${index}.total`}
                      name="total"
                      type="number"
                      step="0.01"
                      value={item.total}
                      readOnly // Total is calculated
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeLineItem(index)}
                  className="mt-2"
                >
                  Remove
                </Button>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={addLineItem}>
              Add Line Item
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            {!invoice?._id && (
              <Button type="button" onClick={handleExtractClick} disabled={!currentInvoice.fileId}>
                Extract with AI
              </Button>
            )}
            <Button type="submit">Save</Button>
            {invoice?._id && (
              <Button type="button" variant="destructive" onClick={handleDeleteClick}>
                Delete
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;

