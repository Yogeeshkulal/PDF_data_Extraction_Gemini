/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY, // Expose Gemini API Key to frontend
    GROQ_API_KEY: process.env.GROQ_API_KEY, // Expose Groq API Key to frontend
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL, // Expose backend API base URL to frontend
  },
};

module.exports = nextConfig;

