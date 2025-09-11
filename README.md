# 📄 PDF Data Extraction Dashboard

AI-powered **PDF Invoice Review Dashboard** built with a **monorepo setup**.

## 🏗️ Tech Stack
- **Frontend (apps/web)** → Next.js (App Router) + TypeScript + [shadcn/ui](https://ui.shadcn.com)  
- **Backend (apps/api)** → Node.js + Express + TypeScript  
- **Database** → MongoDB Atlas  
- **AI Models** → Google Gemini API (Groq optional)  
- **PDF Viewer** → pdf.js (with zoom & page navigation)  
- **Monorepo** → Turborepo / npm workspaces  

---

## 🚀 Features
- Upload and view PDFs in-browser (≤ 25 MB).
- AI extraction of invoice data (vendor, invoice info, line items).
- Editable invoice form with CRUD operations in MongoDB.
- Search invoices by vendor name and invoice number.
- Split UI layout: **Left → PDF Viewer | Right → Invoice Form**.
- Deployed on **Vercel (Web + API)**.

---

