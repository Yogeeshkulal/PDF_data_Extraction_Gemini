Got it ✅
Here’s a **clean README.md** for your repo [`PDF_data_Extraction_Gemini`](https://github.com/Yogeeshkulal/PDF_data_Extraction_Gemini). It explains setup, environment variables, local dev, and Vercel deployment.

---

```markdown
# 📄 PDF Data Extraction Dashboard

AI-powered PDF Invoice Review Dashboard built with a **monorepo** setup.

- **Frontend (apps/web)** → Next.js (App Router) + TypeScript + [shadcn/ui](https://ui.shadcn.com)
- **Backend (apps/api)** → Node.js + Express + TypeScript
- **Database** → MongoDB Atlas
- **AI Models** → Google Gemini API (Groq optional)
- **PDF Viewer** → [pdf.js](https://mozilla.github.io/pdf.js/) with zoom & page navigation
- **Monorepo** → Turborepo / npm workspaces

---

## 🚀 Features
- Upload and view PDFs in-browser (≤25 MB).
- AI extraction of invoice data (vendor, invoice info, line items).
- Editable invoice form with CRUD operations in MongoDB.
- Search invoices by vendor name and invoice number.
- Split UI layout: **Left → PDF Viewer | Right → Invoice Form**.
- Deployed on **Vercel** (Web + API).

---

## 📂 Project Structure

```

PDF\_data\_Extraction\_Gemini/
│── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Express backend
│── packages/
│   └── types/      # Shared TypeScript types
│── vercel.json     # Vercel config for monorepo deployment
│── package.json    # Root workspace config

````

---

## 🔑 Environment Variables

### Backend (`apps/api/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key   # (optional)
````

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

⚠️ On Vercel, set these in **Project → Settings → Environment Variables**.

---

## 🛠️ Local Development

1. **Clone repo**

```bash
git clone https://github.com/Yogeeshkulal/PDF_data_Extraction_Gemini.git
cd PDF_data_Extraction_Gemini
```

2. **Install dependencies**

```bash
npm install
```

3. **Run backend**

```bash
cd apps/api
npm run dev
```

Runs on → [http://localhost:5000](http://localhost:5000)

4. **Run frontend**

```bash
cd ../web
npm run dev
```

Runs on → [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment (Vercel)

### Option 1: Single project (monorepo)

Use `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    { "src": "apps/web/next.config.js", "use": "@vercel/next" },
    { "src": "apps/api/src/server.ts", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "apps/api/src/server.ts" },
    { "src": "/(.*)", "dest": "apps/web/$1" }
  ]
}
```

Then deploy via:

```bash
vercel --prod
```

### Option 2: Separate projects

* **Frontend** → Root = `apps/web`
* **Backend** → Root = `apps/api`
* Update frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://<your-backend>.vercel.app/api
```

---

## 📹 Demo Video

Record a short **3–5 min demo** showing:

1. Upload a PDF
2. View it in the PDF viewer
3. Extract data with AI
4. Edit fields & Save
5. View invoices list
6. Update & Delete invoice

---

## ✅ Acceptance Criteria

* [x] PDF uploads & renders in viewer
* [x] Gemini AI extraction works → valid JSON schema
* [x] CRUD operations persist to MongoDB
* [x] Search works (vendor.name & invoice.number)
* [x] All API endpoints functional
* [x] Deployed successfully on Vercel

---

## 📜 License

MIT © 2025 [Yogeesh Kulal](https://github.com/Yogeeshkulal)

```

---

⚡ Question: Do you want me to also create a **`vercel.json` file** for your repo so it’s ready to deploy as a monorepo (frontend + backend together), or should we stick with **two separate Vercel projects**?
```
