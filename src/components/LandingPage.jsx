import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

/** Set `VITE_DEMO_YOUTUBE_VIDEO_ID` in `.env` to override the embedded demo. */
const DEMO_YOUTUBE_VIDEO_ID =
  import.meta.env.VITE_DEMO_YOUTUBE_VIDEO_ID ?? "DcJyKBO2GeI";

function SearchIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  const closeDemo = useCallback(() => setDemoOpen(false), []);

  useEffect(() => {
    if (!demoOpen) return;
    function onKeyDown(e) {
      if (e.key === "Escape") closeDemo();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [demoOpen, closeDemo]);

  return (
    <div className="relative isolate flex h-[100dvh] max-h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#fafafa]">
      {/* Layered background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.06)_1px,transparent_1px)] bg-[size:56px_56px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_42%,rgba(99,102,241,0.09)_0%,rgba(147,197,253,0.06)_35%,transparent_70%)]"
        aria-hidden
      />
      <div className="landing-bg-noise pointer-events-none absolute inset-0" aria-hidden />

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-8">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Chat with your PDFs
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base text-gray-500 sm:text-lg">
            Upload. Ask. Understand instantly.
          </p>

          <p className="mt-4 max-w-xl text-pretty text-base text-gray-500 sm:text-lg">
          Signup is intentionally restricted to avoid excess API usage. Check the demo video to see the full flow.
          </p>

          <div className="mt-10 w-full max-w-xl">
            <div
              className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-14px_rgba(15,23,42,0.16)] sm:p-5"
              role="presentation"
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-gray-400">
                  <SearchIcon className="size-5 sm:size-[22px]" />
                </span>
                <input
                  type="text"
                  placeholder="Ask anything or upload a document..."
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400 sm:text-base"
                  aria-label="Ask anything or upload a document"
                />
                <button
                  type="button"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  aria-label="Send"
                >
                  <ArrowRightIcon className="size-[18px]" />
                </button>
              </div>
              <div className="mt-4 flex justify-start sm:mt-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                    aria-hidden
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m16 16-4-4-4 4" />
                  </svg>
                  Upload PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            {/* <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-7 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              Get Started
            </Link> */}
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              Watch Demo
            </button>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {demoOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 sm:p-8"
          role="presentation"
          onClick={closeDemo}
        >
          <div
            className="flex w-full max-w-4xl flex-col gap-3"
            role="dialog"
            aria-modal="true"
            aria-label="Demo video"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeDemo}
                className="rounded-xl px-3 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Close
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-xl ring-1 ring-white/10">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${DEMO_YOUTUBE_VIDEO_ID}?rel=0`}
                title="Product demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LandingPage;
