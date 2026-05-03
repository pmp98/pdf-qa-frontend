function Sidebar({ documents, activeDocumentId, onSelect, onUploadNew }) {
  return (
    <aside className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-md shadow-slate-200/40">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800">Documents</h2>
        <button
          type="button"
          onClick={onUploadNew}
          className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        >
          Upload
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {documents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-500">
            Upload a PDF to start asking questions.
          </p>
        ) : (
          documents.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onSelect(doc)}
              className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                doc.id === activeDocumentId
                  ? "border-indigo-400 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-950 shadow-sm ring-1 ring-indigo-200/80"
                  : "border-slate-200/90 bg-slate-50/60 text-slate-700 hover:border-indigo-200 hover:bg-white"
              }`}
            >
              <p className="truncate text-sm font-medium">{doc.filename}</p>
              {/* <p
                className={`mt-1 text-xs ${
                  doc.id === activeDocumentId
                    ? "text-indigo-800/80"
                    : "text-slate-500"
                }`}
              >
                {doc.chunk_count} chunks
              </p> */}
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
