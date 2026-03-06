"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "./ChatContext";

/** On mobile, size the panel to visualViewport so it doesn't overflow when the keyboard opens. */
function useVisualViewportWidth(isOpen: boolean) {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    if (!isOpen || typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const update = () => setWidth(vv.width);
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [isOpen]);
  return width;
}

export function ChatPanel() {
  const { isOpen, closeChat, messages, sendMessage, isLoading, conversationId, loadHistory, startNewConversation } =
    useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const viewportWidth = useVisualViewportWidth(isOpen);

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
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[100vw] flex-col overflow-x-hidden bg-brand-offwhite shadow-2xl md:right-6 md:top-24 md:max-h-[calc(100vh-6rem)] md:max-w-md md:rounded-xl md:border md:border-brand-cream"
        style={
          typeof viewportWidth === "number" && viewportWidth > 0 && viewportWidth < 768
            ? { width: viewportWidth, maxWidth: "100%" }
            : undefined
        }
        aria-label="Chat with Nicole"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-brand-cream bg-brand-cream/40 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-copper/20 text-brand-copper">
              <span className="font-serif text-lg font-semibold">N</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-lg font-semibold text-brand-ink truncate">Nicole</h2>
              <p className="text-xs text-brand-ink/70">Party planning assistant</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
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
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-brand-ink/80 hover:bg-brand-cream hover:text-brand-ink md:min-h-0 md:min-w-0"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="ml-1.5 text-sm font-medium md:hidden">Close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4">
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
                  className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-2.5 break-words ${
                    m.role === "user"
                      ? "bg-brand-ink text-brand-offwhite"
                      : "bg-brand-cream/80 text-brand-ink"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="text-sm leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          ul: ({ children }) => <ul className="my-2 space-y-0.5 pl-4 list-disc">{children}</ul>,
                          ol: ({ children }) => <ol className="my-2 space-y-0.5 pl-4 list-decimal">{children}</ol>,
                          h2: ({ children }) => <h2 className="font-serif font-semibold mt-3 mb-1 first:mt-0 text-base">{children}</h2>,
                          h3: ({ children }) => <h3 className="font-serif font-semibold mt-3 mb-1 first:mt-0 text-sm">{children}</h3>,
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-90">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                  )}
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

        <form onSubmit={handleSubmit} className="w-full shrink-0 overflow-hidden border-t border-brand-cream p-4">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nicole anything about your party…"
              className="min-w-0 rounded-lg border border-brand-cream bg-white px-4 py-3 text-base text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper md:text-sm"
              disabled={isLoading}
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-brand-copper px-4 py-3 text-sm font-medium text-white hover:bg-brand-copper/90 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
          <button
            type="button"
            onClick={closeChat}
            className="mt-3 w-full rounded-lg border border-brand-cream py-2.5 text-center text-sm font-medium text-brand-ink/80 hover:bg-brand-cream/80 md:hidden"
          >
            Close chat · Back to site
          </button>
        </form>
      </aside>
    </>
  );
}
