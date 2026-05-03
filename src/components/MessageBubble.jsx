function MessageBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-900/20"
            : "border border-slate-200/90 bg-slate-50/80 text-slate-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default MessageBubble;
