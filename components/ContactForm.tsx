"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const subject = (formData.get("subject") as string) ?? "";
    const message = (formData.get("message") as string) ?? "";

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl rounded-xl border border-brand-cream bg-white p-8 shadow-sm"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-ink">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={status === "sending"}
            className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper disabled:opacity-60"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-ink">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={status === "sending"}
            className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper disabled:opacity-60"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-brand-ink">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            required
            disabled={status === "sending"}
            className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper disabled:opacity-60"
          >
            <option value="">Select…</option>
            <option value="event-styling">Event styling inquiry</option>
            <option value="balloons">Balloon order / question</option>
            <option value="general">General question</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-brand-ink">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={status === "sending"}
            className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper resize-y disabled:opacity-60"
            placeholder="How can we help?"
          />
        </div>
      </div>

      {status === "success" && (
        <p className="mt-6 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800" role="status">
          Thanks! Your message has been sent. We&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded px-5 py-3.5 text-sm font-medium bg-brand-ink text-brand-offwhite hover:bg-brand-ink/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
