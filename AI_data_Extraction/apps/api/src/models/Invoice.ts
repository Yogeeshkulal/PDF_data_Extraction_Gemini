import mongoose from 'mongoose';
import { Invoice, LineItem, InvoiceInfo, VendorInfo } from '@repo/types';

const LineItemSchema = new mongoose.Schema<LineItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
});

const InvoiceInfoSchema = new mongoose.Schema<InvoiceInfo>({
  number: { type: String, required: true },
  date: { type: String, required: true },
  dueDate: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true },
});

const VendorInfoSchema = new mongoose.Schema<VendorInfo>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  taxId: { type: String },
});

const InvoiceSchema = new mongoose.Schema<Invoice>({
  fileId: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  vendor: { type: VendorInfoSchema, required: true },
  invoiceInfo: { type: InvoiceInfoSchema, required: true },
  lineItems: { type: [LineItemSchema], required: true },
  extractedAt: { type: Date, default: Date.now },
  lastUpdatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<Invoice>('Invoice', InvoiceSchema);

