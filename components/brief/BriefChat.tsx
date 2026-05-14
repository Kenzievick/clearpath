"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAVY = "#1B3A6B";
const NAVY_HOVER = "#152D54";
const INK = "#0B0E0D";
const MUTED = "#5C6360";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

const DEFAULT_PROMPTS = [
  "Walk me through the most important findings",
  "What should I say if they push back on services?",
  "Help me prepare for tomorrow's meeting",
  "What if the school says the IEP is already adequate?",
  "Which accommodations should I fight hardest for?",
  "What is the most important score pattern I should understand?",
];

export default function BriefChat({
  briefId,
  childName,
}: {
  briefId: string;
  childName: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [prompts, setPrompts] = useState<string[]>(DEFAULT_PROMPTS);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history + suggested prompts on mount
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      const [{ data: history }, promptsRes] = await Promise.all([
        supabase
          .from("chat_messages")
          .select("role, content, created_at")
          .eq("brief_id", briefId)
          .order("created_at", { ascending: true }),
        fetch(`/api/briefs/${briefId}/suggested-prompts`).then((r) =>
          r.ok ? r.json() : { prompts: DEFAULT_PROMPTS }
        ),
      ]);

      if (cancelled) return;

      if (history && history.length > 0) {
        setMessages(
          history.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at),
          }))
        );
        setHasStartedChat(true);
      }

      if (promptsRes?.prompts) setPrompts(promptsRes.prompts);
    })();

    return () => {
      cancelled = true;
    };
  }, [briefId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isLoading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setHasStartedChat(true);
      const userMsg: ChatMessage = { role: "user", content: trimmed, timestamp: new Date() };
      // Capture conversation history BEFORE adding the new user message,
      // since the API expects history + the new message separately.
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);

      try {
        const res = await fetch(`/api/briefs/${briefId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, conversationHistory: history }),
        });
        const data = await res.json();
        if (!res.ok || !data.response) {
          throw new Error(data.error ?? "Couldn't get a response.");
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response, timestamp: new Date() },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error.");
        // Roll back the user message so they can retry
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [briefId, isLoading, messages]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  return (
    <section
      className="bg-white rounded-2xl"
      style={{
        border: "1px solid #E5E7EB",
        padding: "28px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <MessageSquare size={20} color={NAVY} strokeWidth={2} />
        <h2 className="font-bold" style={{ color: INK, fontSize: "20px" }}>
          Ask Clearpath
        </h2>
      </div>
      <p style={{ color: MUTED, fontSize: "14px", lineHeight: 1.6, marginBottom: "4px" }}>
        The brief is your foundation. Ask anything about your child&apos;s
        scores, services, or how to handle the meeting.
      </p>
      <p
        style={{
          color: NAVY,
          fontSize: "12px",
          fontStyle: "italic",
          marginBottom: "20px",
        }}
      >
        Every answer is grounded in {childName}&apos;s actual evaluation findings.
      </p>

      {!hasStartedChat && (
        <div className="flex flex-wrap gap-2 mb-6">
          {prompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => sendMessage(p)}
              disabled={isLoading}
              className="rounded-full transition-colors hover:bg-[#EEF2F9] disabled:opacity-50"
              style={{
                border: `1px solid ${NAVY}`,
                color: NAVY,
                background: "#FFFFFF",
                fontSize: "13px",
                padding: "7px 14px",
                fontWeight: 500,
                textAlign: "left",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div
          ref={scrollRef}
          className="space-y-4 mb-4 overflow-y-auto rounded-xl"
          style={{
            maxHeight: "500px",
            background: "#FAFAF7",
            padding: "16px",
            border: "1px solid #F3F4F6",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col animate-message ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              {m.role === "assistant" && (
                <span
                  className="uppercase font-semibold mb-1"
                  style={{ color: MUTED, fontSize: "10px", letterSpacing: "0.12em" }}
                >
                  Clearpath
                </span>
              )}
              <div
                className="rounded-2xl whitespace-pre-wrap"
                style={{
                  background: m.role === "user" ? NAVY : "#FFFFFF",
                  color: m.role === "user" ? "#FFFFFF" : INK,
                  border: m.role === "user" ? "none" : `1px solid ${NAVY}`,
                  padding: "12px 16px",
                  fontSize: "14.5px",
                  lineHeight: 1.6,
                  maxWidth: m.role === "user" ? "80%" : "85%",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start">
              <span
                className="uppercase font-semibold mb-1"
                style={{ color: MUTED, fontSize: "10px", letterSpacing: "0.12em" }}
              >
                Clearpath
              </span>
              <div
                className="rounded-2xl inline-flex items-center gap-1.5"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${NAVY}`,
                  padding: "14px 18px",
                }}
              >
                <span
                  className="typing-dot rounded-full"
                  style={{ width: "6px", height: "6px", background: NAVY }}
                />
                <span
                  className="typing-dot rounded-full"
                  style={{ width: "6px", height: "6px", background: NAVY }}
                />
                <span
                  className="typing-dot rounded-full"
                  style={{ width: "6px", height: "6px", background: NAVY }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p
          className="mb-3"
          style={{ color: "#C04A3A", fontSize: "13px", fontWeight: 500 }}
        >
          {error}
        </p>
      )}

      {/* Input */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={2}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${childName}'s report...`}
          disabled={isLoading}
          className="flex-1 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
          style={{
            border: "1px solid #D1D5DB",
            padding: "12px",
            fontSize: "14.5px",
            color: INK,
            background: "#FFFFFF",
            lineHeight: 1.5,
          }}
        />
        <button
          type="button"
          onClick={() => sendMessage(inputValue)}
          disabled={isLoading || inputValue.trim().length === 0}
          aria-label="Send"
          className="rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: NAVY,
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 600,
            transition: "background 150ms ease",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && inputValue.trim().length > 0) {
              e.currentTarget.style.background = NAVY_HOVER;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = NAVY;
          }}
        >
          <Send size={16} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}

