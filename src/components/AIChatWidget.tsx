import { useState } from "react";
import { Bot, Send, X, Minimize2, Maximize2 } from "lucide-react";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<
    { role: "ai" | "user"; text: string }[]
  >([
    {
      role: "ai",
      text: "Hello! I am the Curexal AI Assistant. How can I help you today?",
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
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Open AI Assistant"
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white border border-slate-100 rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? "h-14 w-72" : "h-[500px] w-80 sm:w-96"}`}
    >
      {/* Header */}
      <div
        className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2 font-medium">
          <Bot size={20} />
          <span>Curexal AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-primary-500 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            className="p-1 hover:bg-primary-500 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white rounded-br-none"
                      : "bg-white border border-slate-100 text-slate-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
