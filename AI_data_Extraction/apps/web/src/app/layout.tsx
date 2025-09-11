import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PDF Review Dashboard",
  description: "Full-stack PDF review dashboard for internship assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="p-4 border-b flex justify-between items-center">
          <Link href="/">
            <h1 className="text-xl font-bold">PDF Dashboard</h1>
          </Link>
          <Link href="/invoices">
            <button className="px-4 py-2 rounded-md border">View Invoices</button>
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
