"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "./ChatContext";

export function ChatPanel() {
  const { isOpen, closeChat, messages, sendMessage, isLoading, conversationId, loadHistory, startNewConversation } =
    useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && conversationId && messages.length === 0) {
      loadHistory(conversationId);
    }
  }, [isOpen, conversationId, messages.length, loadHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-brand-ink/30 transition-opacity md:bg-transparent"
        aria-hidden
        onClick={closeChat}
      />
      <aside
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-brand-offwhite shadow-2xl md:bottom-auto md:right-6 md:top-24 md:max-h-[calc(100vh-6rem)] md:rounded-xl md:border md:border-brand-cream"
        aria-label="Chat with Nicole"
      >
        <div className="flex items-center justify-between border-b border-brand-cream bg-brand-cream/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-copper/20 text-brand-copper">
              <span className="font-serif text-lg font-semibold">N</span>
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-brand-ink">Nicole</h2>
              <p className="text-xs text-brand-ink/70">Party planning assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={startNewConversation}
                className="rounded px-2 py-1.5 text-xs font-medium text-brand-ink/70 hover:bg-brand-cream hover:text-brand-ink"
              >
                New chat
              </button>
            )}
            <button
              type="button"
              onClick={closeChat}
              className="rounded p-2 text-brand-ink/80 hover:bg-brand-cream hover:text-brand-ink"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-serif text-lg text-brand-ink">Hi, I’m Nicole.</p>
              <p className="mt-2 text-sm text-brand-ink/80 max-w-xs">
                I’m here to help you plan an amazing party. Tell me the occasion, who it’s for, and any ideas you
                have—I’ll ask a few questions and then share ideas tailored to you.
              </p>
            </div>
          )}
          <ul className="space-y-4">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    m.role === "user"
                      ? "bg-brand-ink text-brand-offwhite"
                      : "bg-brand-cream/80 text-brand-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                </div>
              </li>
            ))}
            {isLoading && (
              <li className="flex justify-start">
                <div className="rounded-2xl bg-brand-cream/80 px-4 py-2.5">
                  <span className="text-sm text-brand-ink/70">Nicole is thinking…</span>
                </div>
              </li>
            )}
          </ul>
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-brand-cream p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nicole anything about your party…"
              className="flex-1 rounded-lg border border-brand-cream bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
              disabled={isLoading}
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="shrink-0 rounded-lg bg-brand-copper px-4 py-3 text-sm font-medium text-white hover:bg-brand-copper/90 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
