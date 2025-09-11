import React, { useState, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `pdfjs-dist/build/pdf.worker.entry`;

interface PdfViewerProps {
  fileUrl: string; // URL of the PDF file
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial set

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page on new document load
  };

  const goToPrevPage = () =>
    setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber - 1));
  const goToNextPage = () =>
    setPageNumber((prevPageNumber) => Math.min(numPages || 1, prevPageNumber + 1));

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center p-2 border-b gap-2">
        <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="px-3 py-1 border rounded">Prev</button>
        <span>
          Page {pageNumber} of {numPages || '--'}
        </span>
        <button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)} className="px-3 py-1 border rounded">Next</button>
        <button onClick={zoomIn} className="px-3 py-1 border rounded">+</button>
        <span>{(scale * 100).toFixed(0)}%</span>
        <button onClick={zoomOut} className="px-3 py-1 border rounded">-</button>
      </div>
      <div ref={containerRef} className="flex-grow overflow-auto p-4 flex justify-center items-center">
        {fileUrl ? (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error}
            className="shadow-lg"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              width={containerWidth ? Math.min(containerWidth - 40, 800) : 800} // Max width 800px, responsive
            />
          </Document>
        ) : (
          <p className="text-gray-500">Upload a PDF to view</p>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;

