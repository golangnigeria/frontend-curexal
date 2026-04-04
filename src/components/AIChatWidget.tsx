import { useState } from "react";
import { Bot, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "../lib/utils";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<
    { role: "ai" | "user"; text: string }[]
  >([
    {
      role: "ai",
      text: "Hello! I am the curexal AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const userText = input;
    setInput("");

    // Mock AI Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `I'm a placeholder AI. You said: "${userText}". Once the backend AI endpoints are ready, I'll connect to them!`,
        },
      ]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary-400 hover:bg-primary-500 text-white rounded-2xl shadow-lg hidden lg:flex items-center justify-center transition-all hover:scale-110 shadow-primary-400/20 z-[60]"
        aria-label="Open AI Assistant"
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-[60] bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
        isMinimized 
          ? "bottom-6 right-6 h-14 w-72 rounded-xl border border-slate-100" 
          : "bottom-0 right-0 h-full w-full sm:bottom-6 sm:right-6 sm:h-[500px] sm:w-80 md:w-96 sm:rounded-xl sm:border sm:border-slate-100"
      )}
    >
      {/* Header */}
      <div
        className="bg-accent-500 text-white px-4 py-4 flex items-center justify-between cursor-pointer shrink-0"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2 font-bold lowercase tracking-tighter">
          <Bot size={20} className="text-primary-400" />
          <span>curexal AI</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-white/10 rounded transition-colors hidden sm:block"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium shadow-sm transition-all",
                    msg.role === "user"
                      ? "bg-primary-500 text-white rounded-br-none"
                      : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 pb-safe">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="How can I help you?"
                className="flex-1 px-4 py-3 text-sm bg-slate-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 font-medium placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:scale-95 transition-all shadow-md shadow-primary-500/20"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
