import { GoogleGenerativeAI } from '@google/generative-ai';
import { Invoice } from '@repo/types';
// import Groq from 'groq'; // Commented out as Groq package had issues

interface ExtractedInvoiceData {
  vendor: { name: string; address: string; taxId?: string };
  invoiceInfo: { number: string; date: string; dueDate: string; totalAmount: number; currency: string };
  lineItems: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
}

let geminiModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;
// let groqModel: any = null; // Placeholder for Groq model

export const initializeAIModels = (geminiApiKey?: string, groqApiKey?: string) => {
  if (geminiApiKey) {
    const geminiAI = new GoogleGenerativeAI(geminiApiKey);
    geminiModel = geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } else {
    console.warn('Gemini API key not provided. Gemini extraction will be unavailable.');
    geminiModel = null;
  }

  // if (groqApiKey) {
  //   const groq = new Groq({ apiKey: groqApiKey });
  //   groqModel = groq.getChatCompletions({ model: 'llama3-70b-8192' });
  // } else {
  //   console.warn('Groq API key not provided. Groq extraction will be unavailable.');
  //   groqModel = null;
  // }
};

export const extractFromPDF = async (pdfText: string): Promise<ExtractedInvoiceData | { error: string; details: string }> => {
  if (!geminiModel) {
    return { error: "Gemini extraction failed", details: "Gemini API key not configured or model not initialized." };
  }

  try {
    const prompt = `Extract the following structured data from this invoice text: ${pdfText}. Specifically, I need: vendor (name, address, taxId), invoiceInfo (number, date (YYYY-MM-DD), dueDate (YYYY-MM-DD), totalAmount, currency), and lineItems (description, quantity, unitPrice, total). Ensure all dates are in YYYY-MM-DD format. Return the data as a JSON object only.`;
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Attempt to extract JSON from markdown code block if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      text = jsonMatch[1];
    }

    // Attempt to parse JSON. If it fails, it might not be a valid JSON response from Gemini.
    try {
      const parsed = JSON.parse(text) as ExtractedInvoiceData;
      return parsed;
    } catch (parseError: any) {
      console.error('Error parsing Gemini response to JSON:', parseError);
      return { error: "Gemini extraction failed", details: `Invalid JSON response from Gemini: ${text.substring(0, 200)}...` };
    }
  } catch (error: any) {
    console.error('Error during Gemini API call:', error);
    let errorMessage = 'An unknown error occurred during Gemini extraction.';
    if (error.response && error.response.status) {
      errorMessage = `Gemini API error: Status ${error.response.status} - ${error.response.statusText || 'Unknown'}`;
    } else if (error.message) {
      errorMessage = `Gemini API error: ${error.message}`;
    }
    return { error: "Gemini extraction failed", details: errorMessage };
  }
};

export const extractInvoiceData = async (pdfText: string, modelType: 'gemini' | 'groq'): Promise<ExtractedInvoiceData | { error: string; details: string }> => {
  if (modelType === 'gemini') {
    return extractFromPDF(pdfText);
  } else if (modelType === 'groq') {
    // if (!groqModel) {
    //   return { error: "Groq extraction failed", details: "Groq API key not configured or model not initialized." };
    // }
    // try {
    //   // Groq implementation will go here
    // } catch (error) {
    //   console.error('Error extracting with Groq:', error);
    //   return { error: "Groq extraction failed", details: error.message || 'Groq extraction failed' };
    // }
    return { error: "Groq API not yet implemented", details: "Groq API not yet implemented or package not available." };
  } else {
    return { error: "Invalid model type", details: "Invalid model type provided for extraction." };
  }
};

