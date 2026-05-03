import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function PdfViewer({ fileUrl, highlightText, documentName }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    setNumPages(0);
    setCurrentPage(1);
  }, [fileUrl]);

  const highlightRegex = useMemo(() => {
    const text = (highlightText || "").trim();
    if (!text) return null;
    return new RegExp(escapeRegex(text), "gi");
  }, [highlightText]);

  useEffect(() => {
    if (!highlightText || !containerRef.current) return;
    const timer = setTimeout(() => {
      const highlighted = containerRef.current.querySelector("mark.pdf-highlight");
      if (highlighted) {
        highlighted.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [highlightText, currentPage, numPages]);

  if (!fileUrl) {
    return (
      <div className="flex h-full min-h-0 max-h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-indigo-200/70 bg-gradient-to-br from-white to-indigo-50/40 p-8 text-center">
        <p className="max-w-sm text-sm leading-relaxed text-slate-600">
          Preview isn&apos;t available for this document yet (no file on the server).
          Use <span className="font-medium text-indigo-700">Upload New PDF</span> to
          replace or add a copy so highlights and viewing work after refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/50">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
        <p className="truncate font-medium">{documentName || "PDF Preview"}</p>
        <p>
          Page {currentPage}
          {numPages ? ` / ${numPages}` : ""}
        </p>
      </div>

      <div
        ref={containerRef}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-auto overscroll-contain p-4"
      >
        <Document
          key={fileUrl}
          file={fileUrl}
          onLoadSuccess={({ numPages: totalPages }) => {
            setNumPages(totalPages);
            setCurrentPage(1);
          }}
          loading={<p className="text-sm text-slate-500">Loading PDF...</p>}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={`page-${index + 1}`}
              className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-2"
              onMouseEnter={() => setCurrentPage(index + 1)}
            >
              <Page
                pageNumber={index + 1}
                width={580}
                renderTextLayer
                renderAnnotationLayer
                customTextRenderer={({ str }) => {
                  if (!highlightRegex) return str;
                  return str.replace(
                    highlightRegex,
                    (match) =>
                      `<mark class="pdf-highlight rounded bg-yellow-200/80 px-0.5">${match}</mark>`
                  );
                }}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

export default PdfViewer;
