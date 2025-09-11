import { Invoice, FileUploadResponse, ExtractInvoicePayload, ExtractInvoiceResponse, GetInvoicesQuery } from '@repo/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/invoices';
const PARSE_PDF_URL = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL.replace('/invoices', '') + '/parse-pdf' : 'http://localhost:5000/api/parse-pdf';

export const uploadPdf = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload PDF');
  }
  return response.json();
};

export const parsePdf = async (file: File): Promise<{ text: string; success: boolean; error?: string; details?: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(PARSE_PDF_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.details || errorData.message || 'Failed to parse PDF text');
  }
  return response.json();
};

export const extractInvoice = async (payload: ExtractInvoicePayload): Promise<ExtractInvoiceResponse> => {
  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to extract invoice');
  }
  return response.json();
};

export const getInvoices = async (query?: GetInvoicesQuery): Promise<Invoice[]> => {
  const queryString = query
    ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
    : '';
  const response = await fetch(`${API_BASE_URL}${queryString}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch invoices');
  }
  return response.json();
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch invoice');
  }
  return response.json();
};

export const updateInvoice = async (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update invoice');
  }
  return response.json();
};

export const createInvoice = async (invoice: Partial<Invoice>): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create invoice');
  }
  return response.json();
};

export const deleteInvoice = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete invoice');
  }
};

