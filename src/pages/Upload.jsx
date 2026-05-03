import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Upload({
  embedded = false,
  onUploaded = null,
  onCancel = null,
  showLogout = true,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onFileSelect(selected) {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    setError("");
    setFile(selected);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/upload", formData);
      const doc = data?.data;
      const fileUrl = URL.createObjectURL(file);
      if (onUploaded) {
        onUploaded(doc, fileUrl);
      } else {
        navigate("/dashboard", {
          state: {
            uploadedDocument: doc,
            uploadedFileUrl: fileUrl,
          },
          replace: true,
        });
      }
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  const containerClasses = embedded
    ? "w-full rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm"
    : "w-full max-w-xl rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-indigo-900/10";

  return (
    <div
      className={
        embedded
          ? "w-full"
          : "flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-50/60 px-4"
      }
    >
      <div className={containerClasses}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            {embedded ? "Upload your first PDF" : "Upload PDF"}
          </h1>
          <div className="flex items-center gap-2">
            {embedded && onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
              >
                Close
              </button>
            ) : null}
            {showLogout ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            onFileSelect(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
            isDragging
              ? "border-indigo-500 bg-indigo-50/90"
              : "border-slate-300 bg-gradient-to-br from-slate-50 to-indigo-50/35 hover:border-indigo-300"
          }`}
        >
          <p className="text-sm font-medium text-slate-700">
            Drag and drop your PDF here
          </p>
          <p className="mt-1 text-xs text-slate-500">or click to browse</p>
          {file ? (
            <p className="mt-3 text-xs font-medium text-slate-800">{file.name}</p>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files?.[0])}
        />

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-900/15 transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>
    </div>
  );
}

export default Upload;
