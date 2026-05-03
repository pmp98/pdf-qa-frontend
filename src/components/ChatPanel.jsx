import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";
import MessageBubble from "./MessageBubble";

function ChatPanel({ activeDocument, onHighlight }) {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messageEndRef = useRef(null);
  const loadGenRef = useRef(0);

  const canAsk = useMemo(
    () => !!activeDocument && question.trim().length > 0 && !isThinking,
    [activeDocument, question, isThinking]
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    const docId = activeDocument?.id;
    if (!docId) {
      setMessages([]);
      setChatId(null);
      return undefined;
    }

    let cancelled = false;
    const gen = ++loadGenRef.current;

    (async () => {
      try {
        const { data } = await api.get(`/documents/${docId}/chat`);
        if (cancelled || gen !== loadGenRef.current) return;
        const payload = data?.data;
        setChatId(payload?.chat_id ?? null);
        setMessages(
          (payload?.messages || []).map((m) => ({
            id: m.id,
            role: m.role,
            text: m.content,
          }))
        );
      } catch {
        if (!cancelled && gen === loadGenRef.current) {
          setMessages([]);
          setChatId(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeDocument?.id]);

  async function streamAssistantText(answer, sourceSnippet) {
    const words = answer.split(" ");
    let built = "";
    for (let index = 0; index < words.length; index += 1) {
      built += `${words[index]}${index === words.length - 1 ? "" : " "}`;
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", text: built };
        return copy;
      });
      await new Promise((resolve) => setTimeout(resolve, 28));
    }
    if (sourceSnippet) onHighlight(sourceSnippet);
  }

  async function handleAsk(event) {
    event.preventDefault();
    if (!canAsk) return;

    const userMessage = question.trim();
    setQuestion("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
      { role: "assistant", text: "Thinking..." },
    ]);
    setIsThinking(true);

    try {
      const { data } = await api.post("/chat", {
        message: userMessage,
        chat_id: chatId ?? undefined,
        document_id: activeDocument?.id,
      });
      const payload = data?.data;
      if (payload?.chat_id != null) {
        setChatId(payload.chat_id);
      }
      const answer =
        payload?.answer || "I could not generate a response.";
      const source = payload?.sources?.[0];
      const snippet =
        source?.chunkText ||
        answer
          .split(/[.!?]/)[0]
          .split(" ")
          .slice(0, 16)
          .join(" ");
      await streamAssistantText(answer, snippet);
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Request failed. Please try again.";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", text: message };
        return copy;
      });
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <section className="flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/40">
      <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/40 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">Chat</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          {activeDocument
            ? `Scoped to: ${activeDocument.filename}`
            : "Pick a PDF from the library or sidebar to load preview and saved messages."}
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
        {messages.map((message, idx) => (
          <MessageBubble
            key={
              message.id != null
                ? `${message.role}-${message.id}`
                : `${message.role}-${idx}`
            }
            role={message.role}
            text={message.text}
          />
        ))}
        <div ref={messageEndRef} />
      </div>

      <form
        onSubmit={handleAsk}
        className="shrink-0 border-t border-slate-200 bg-white p-3"
      >
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-2">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question about your document..."
            className="w-full bg-transparent px-2 text-sm text-slate-700 outline-none"
          />
          <button
            type="submit"
            disabled={!canAsk}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}

export default ChatPanel;
