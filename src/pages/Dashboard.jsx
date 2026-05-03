import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import PdfViewer from "../components/PdfViewer";
import ChatPanel from "../components/ChatPanel";
import DocumentLibrary from "../components/DocumentLibrary";
import Upload from "./Upload";

const SELECTED_DOC_KEY = "selectedDocumentId";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [previewMap, setPreviewMap] = useState({});
  const [highlightText, setHighlightText] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const previewUrlsRef = useRef({});

  async function fetchDocuments() {
    setLoadingDocs(true);
    try {
      const { data } = await api.get("/documents");
      const docs = data?.data?.documents || [];
      setDocuments(docs);
      const uploadedId = location.state?.uploadedDocument?.documentId;
      const savedSelectedId = Number(localStorage.getItem(SELECTED_DOC_KEY));
      if (
        Number.isFinite(savedSelectedId) &&
        !docs.some((d) => d.id === savedSelectedId)
      ) {
        localStorage.removeItem(SELECTED_DOC_KEY);
      }
      setActiveDocument((prev) => {
        if (prev && docs.some((doc) => doc.id === prev.id)) return prev;
        if (uploadedId) {
          return docs.find((doc) => doc.id === uploadedId) ?? null;
        }
        if (Number.isFinite(savedSelectedId)) {
          return docs.find((doc) => doc.id === savedSelectedId) ?? null;
        }
        return null;
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoadingDocs(false);
    }
  }

  useEffect(() => {
    const uploadedDocument = location.state?.uploadedDocument;
    const uploadedFileUrl = location.state?.uploadedFileUrl;
    if (uploadedDocument?.documentId && uploadedFileUrl) {
      setPreviewMap((prev) => ({
        ...prev,
        [uploadedDocument.documentId]: uploadedFileUrl,
      }));
    }
    fetchDocuments();
  }, [navigate, location.state]);

  const activePreviewUrl = useMemo(() => {
    if (!activeDocument) return "";
    return previewMap[activeDocument.id] || activeDocument.previewUrl || "";
  }, [activeDocument, previewMap]);

  useEffect(() => {
    previewUrlsRef.current = previewMap;
  }, [previewMap]);

  useEffect(() => {
    const id = activeDocument?.id;
    if (!id) return undefined;

    if (previewUrlsRef.current[id]) return undefined;

    let cancelled = false;
    let blobUrl = null;
    let applied = false;

    (async () => {
      try {
        const res = await api.get(`/documents/${id}/file`, {
          responseType: "blob",
        });
        blobUrl = URL.createObjectURL(res.data);
        if (cancelled) {
          URL.revokeObjectURL(blobUrl);
          return;
        }
        applied = true;
        setPreviewMap((prev) => ({ ...prev, [id]: blobUrl }));
      } catch {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      }
    })();

    return () => {
      cancelled = true;
      if (blobUrl && !applied) URL.revokeObjectURL(blobUrl);
    };
  }, [activeDocument?.id]);

  useEffect(() => {
    if (activeDocument?.id) {
      localStorage.setItem(SELECTED_DOC_KEY, String(activeDocument.id));
    }
  }, [activeDocument?.id]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  function handleUploadedDocument(doc, fileUrl) {
    if (!doc?.documentId) return;
    const newDoc = {
      id: doc.documentId,
      filename: doc.filename || "uploaded.pdf",
      chunk_count: doc.chunkCount || 0,
    };
    setPreviewMap((prev) => ({ ...prev, [doc.documentId]: fileUrl }));
    setDocuments((prev) => {
      const withoutSame = prev.filter((item) => item.id !== newDoc.id);
      return [newDoc, ...withoutSame];
    });
    setActiveDocument(newDoc);
    setHighlightText("");
    setShowUploadPanel(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50/50 p-4 md:p-6">
      <div className="mx-auto mb-5 flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-5 py-4 text-white shadow-lg shadow-indigo-900/20">
        <div>
          <h1 className="text-base font-semibold tracking-tight">PDF Q&A</h1>
          <p className="mt-0.5 text-xs text-indigo-100/95">
            Preview, chat, and answers scoped to each upload
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-xl border border-white/35 bg-white/15 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Log out
        </button>
      </div>

      {loadingDocs ? (
        <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-[1600px] items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 text-sm text-slate-500 shadow-md backdrop-blur-sm">
          Loading your library…
        </div>
      ) : documents.length === 0 ? (
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[560px] flex-col items-center justify-center px-2">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-slate-800">
              No documents yet
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Sign in is complete. Upload a PDF to index it—then you can open it,
              preview pages, and chat with context from that file.
            </p>
          </div>
          <Upload embedded onUploaded={handleUploadedDocument} showLogout={false} />
        </div>
      ) : (
        <div className="mx-auto grid h-[calc(100vh-8rem)] min-h-0 w-full max-w-[1600px] grid-cols-12 gap-4">
          <div className="col-span-12 flex h-full min-h-0 flex-col lg:col-span-2">
            <Sidebar
              documents={documents}
              activeDocumentId={activeDocument?.id}
              onUploadNew={() => setShowUploadPanel(true)}
              onSelect={(doc) => {
                setActiveDocument(doc);
                setHighlightText("");
              }}
            />
          </div>

          <div className="col-span-12 flex h-full min-h-0 flex-col lg:col-span-6">
            {activeDocument ? (
              <PdfViewer
                fileUrl={activePreviewUrl}
                highlightText={highlightText}
                documentName={activeDocument.filename}
              />
            ) : (
              <DocumentLibrary
                documents={documents}
                onPick={(doc) => {
                  setActiveDocument(doc);
                  setHighlightText("");
                }}
              />
            )}
          </div>

          <div className="col-span-12 flex h-full min-h-0 flex-col lg:col-span-4">
            <ChatPanel
              activeDocument={activeDocument}
              onHighlight={(snippet) => setHighlightText(snippet)}
            />
          </div>
        </div>
      )}

      {showUploadPanel ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <Upload
              embedded
              onUploaded={handleUploadedDocument}
              onCancel={() => setShowUploadPanel(false)}
              showLogout={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
