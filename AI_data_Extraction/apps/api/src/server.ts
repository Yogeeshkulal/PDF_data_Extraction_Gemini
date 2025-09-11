import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import path from 'path';
import { initializeAIModels } from './services/aiService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize AI models after environment variables are loaded
initializeAIModels(process.env.GEMINI_API_KEY, process.env.GROQ_API_KEY);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database', err);
  });
