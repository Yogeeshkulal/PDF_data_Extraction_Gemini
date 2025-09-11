const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoicePdf(invoiceData, filePath) {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(25).text('INVOICE', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice Number: ${invoiceData.invoiceInfo.number}`);
  doc.text(`Date: ${invoiceData.invoiceInfo.date}`);
  doc.text(`Due Date: ${invoiceData.invoiceInfo.dueDate}`);
  doc.moveDown();

  doc.text(`Vendor: ${invoiceData.vendor.name}`);
  doc.text(`Address: ${invoiceData.vendor.address}`);
  if (invoiceData.vendor.taxId) {
    doc.text(`Tax ID: ${invoiceData.vendor.taxId}`);
  }
  doc.moveDown();

  doc.fontSize(15).text('Line Items:');
  doc.moveDown();

  invoiceData.lineItems.forEach(item => {
    doc.fontSize(10).text(
      `${item.description} - Qty: ${item.quantity}, Unit Price: ${item.unitPrice.toFixed(2)}, Total: ${item.total.toFixed(2)}`
    );
  });
  doc.moveDown();

  doc.fontSize(12).text(`Total Amount: ${invoiceData.invoiceInfo.totalAmount.toFixed(2)} ${invoiceData.invoiceInfo.currency}`, { align: 'right' });

  doc.end();
  console.log(`Generated sample PDF: ${filePath}`);
}

const sampleInvoice = {
  vendor: {
    name: 'Tech Solutions Inc.',
    address: '123 Main St, Anytown, USA',
    taxId: 'ABC123456789',
  },
  invoiceInfo: {
    number: 'INV-2023-001',
    date: '2023-10-26',
    dueDate: '2023-11-26',
    totalAmount: 1250.00,
    currency: 'USD',
  },
  lineItems: [
    { description: 'Software Development', quantity: 1, unitPrice: 1000.00, total: 1000.00 },
    { description: 'Consulting Services', quantity: 5, unitPrice: 50.00, total: 250.00 },
  ],
};

generateInvoicePdf(sampleInvoice, 'sample_invoice.pdf');
