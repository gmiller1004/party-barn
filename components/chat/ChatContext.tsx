"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "party_barn_chat_conversation_id";
const SEND_TRANSCRIPT_URL = "/api/chat/send-transcript";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

type ChatContextValue = {
  conversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  loadHistory: (conversationId: string) => Promise<void>;
  startNewConversation: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getStoredConversationId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredConversationId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) sessionStorage.setItem(STORAGE_KEY, id);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Fire-and-forget: request transcript email for this conversation if eligible (has email, not yet sent). */
function requestSendTranscript(conversationId: string) {
  if (typeof window === "undefined") return;
  fetch(SEND_TRANSCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId }),
    credentials: "include",
    keepalive: true,
  }).catch(() => {});
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversationId, setConversationIdState] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  conversationIdRef.current = conversationId;

  const setConversationId = useCallback((id: string | null) => {
    setConversationIdState(id);
    setStoredConversationId(id);
  }, []);

  useEffect(() => {
    const stored = getStoredConversationId();
    if (stored) setConversationIdState(stored);
  }, []);

  // When user closes tab or navigates away, try to send transcript (sendBeacon survives page unload).
  useEffect(() => {
    const handlePageHide = () => {
      const id = conversationIdRef.current;
      if (!id) return;
      const payload = JSON.stringify({ conversationId: id });
      navigator.sendBeacon(SEND_TRANSCRIPT_URL, new Blob([payload], { type: "application/json" }));
    };
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, []);

  const loadHistory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/chat/${id}`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      const list = (data.messages ?? []).map((m: { id: string; role: string; content: string; createdAt?: string }) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: m.createdAt,
      }));
      setConversationId(id);
      setMessages(list);
    } catch {
      // ignore
    }
  }, [setConversationId]);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { id: makeId(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          conversationId: conversationId ?? undefined,
          message: trimmed,
        }),
      });
      let data: { conversationId?: string; message?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        throw new Error(data.error ?? "Something went wrong.");
      }

      setConversationId(data.conversationId ?? conversationId);
      const assistantMsg: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: data.message ?? "",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      const errContent =
        e instanceof Error && e.message ? e.message : "Sorry, I couldn’t reply right now. Please try again in a moment.";
      const errMsg: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: errContent,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, isLoading]);

  const startNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
  }, [setConversationId]);

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        messages,
        isLoading,
        isOpen,
        openChat: () => setIsOpen(true),
        closeChat: () => {
        if (conversationId) requestSendTranscript(conversationId);
        setIsOpen(false);
      },
        toggleChat: () => setIsOpen((o) => !o),
        sendMessage,
        loadHistory,
        startNewConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
