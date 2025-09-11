import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import invoiceRoutes from './routes/invoiceRoutes';
import pdfParseRoutes from './routes/pdfParseRoutes';

const app = express();

// Middleware
app.use(cors());
// app.use(express.json()); // Removed global JSON body parser to avoid conflict with multer
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/invoices', invoiceRoutes);
app.use('/api', pdfParseRoutes);

export default app;
