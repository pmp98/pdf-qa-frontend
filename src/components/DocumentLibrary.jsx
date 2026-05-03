function DocumentLibrary({ documents, onPick }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/40">
      <div className="border-b border-indigo-100/80 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-slate-800">
          Open a document
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          Pick a PDF to load the preview and your saved chat for that file. You can
          switch anytime from the left panel.
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onPick(doc)}
              className="group flex flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/90 p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-xs font-bold uppercase tracking-wide text-indigo-700">
                PDF
              </span>
              <p className="mt-3 truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-900">
                {doc.filename}
              </p>
              {/* <p className="mt-1 text-xs text-slate-500">
                {doc.chunk_count} indexed chunks
              </p> */}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DocumentLibrary;
