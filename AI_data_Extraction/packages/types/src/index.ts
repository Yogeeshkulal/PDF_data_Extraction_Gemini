export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceInfo {
  number: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
}

export interface VendorInfo {
  name: string;
  address: string;
  taxId?: string;
}

export interface Invoice {
  _id?: string; // MongoDB ObjectId
  fileId: string;
  fileName: string;
  vendor: VendorInfo;
  invoiceInfo: InvoiceInfo;
  lineItems: LineItem[];
  extractedAt: Date;
  lastUpdatedAt: Date;
}

export interface FileUploadResponse {
  fileId: string;
  fileName: string;
}

export interface ExtractInvoicePayload {
  fileId: string;
  model: 'gemini' | 'groq';
  extractedText: string;
}

export interface ExtractInvoiceResponse {
  invoice: Invoice;
}

export interface GetInvoicesQuery {
  vendorName?: string;
  invoiceNumber?: string;
}
