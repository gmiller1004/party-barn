"use client";

import { useChat } from "./ChatContext";

export function ChatButton() {
  const { toggleChat, isOpen } = useChat();

  return (
    <button
      type="button"
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand-copper text-white shadow-lg hover:bg-brand-copper/90 focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2 transition-transform hover:scale-105"
      aria-label={isOpen ? "Close chat with Nicole" : "Chat with Nicole"}
      aria-expanded={isOpen}
    >
      <span className="font-serif text-xl font-semibold" aria-hidden>N</span>
    </button>
  );
}
