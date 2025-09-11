.

📄 PDF Data Extraction Dashboard

AI-powered PDF Invoice Review Dashboard built with a monorepo setup.

Frontend (apps/web) → Next.js (App Router) + TypeScript + shadcn/ui

Backend (apps/api) → Node.js + Express + TypeScript

Database → MongoDB Atlas

AI Models → Google Gemini API (Groq optional)

PDF Viewer → pdf.js
 with zoom & page navigation

Monorepo → Turborepo / npm workspaces

🚀 Features

Upload and view PDFs in-browser (≤25 MB).

AI extraction of invoice data (vendor, invoice info, line items).

Editable invoice form with CRUD operations in MongoDB.

Search invoices by vendor name and invoice number.

Split UI layout: Left → PDF Viewer | Right → Invoice Form.

Deployed on Vercel (Web + API).

📂 Project Structure
PDF_data_Extraction_Gemini/
│── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Express backend
│── packages/
│   └── types/      # Shared TypeScript types
│── vercel.json     # Vercel config for monorepo deployment
│── package.json    # Root workspace config

🔑 Environment Variables
Backend (apps/api/.env)
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key   # (optional)

Frontend (apps/web/.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api


⚠️ On Vercel, set these in Project → Settings → Environment Variables.

🛠️ Local Development

Clone repo

git clone https://github.com/Yogeeshkulal/PDF_data_Extraction_Gemini.git
cd PDF_data_Extraction_Gemini


Install dependencies

npm install


Run backend

cd apps/api
npm run dev


Runs on → http://localhost:5000

Run frontend

cd ../web
npm run dev


Runs on → http://localhost:3000
