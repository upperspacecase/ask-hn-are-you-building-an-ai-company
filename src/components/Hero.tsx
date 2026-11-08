"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "done" | "error";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-20 sm:pt-28">
      <h1 className="display max-w-4xl">
        &ldquo;Where are we with Client X?&rdquo; answered from their last call
        transcript, their open tickets and their deploy log, not from whoever
        happened to be in the meeting.
      </h1>

      <p className="body mt-6 max-w-2xl text-muted">
        For tech leads at 20-to-100-person software shops who were told to
        build the company&rsquo;s AI brain this quarter and have no budget line
        to buy one.
      </p>

      {status === "done" ? (
        <p className="body mt-8 max-w-2xl font-medium">
          Noted. The starter repo goes to {email} on December 15, 2026, when
          the first connector set ships. Nothing else arrives before that.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="email" className="sr-only">
            Work email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="body h-14 w-full rounded-md sm:flex-1 border border-line bg-surface px-4 text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="body h-14 cursor-pointer rounded-md bg-accent px-6 font-semibold text-white transition-colors duration-200 hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-wait disabled:opacity-70"
          >
            {status === "submitting" ? "Sending" : "Email me the starter repo"}
          </button>
        </form>
      )}

      <p className="body mt-3 max-w-2xl text-muted">
        {status === "error"
          ? "That did not go through. Try again in a moment."
          : "One command, your servers, your existing Claude Code setup, no account. First connector set ships December 15, 2026; nothing else arrives before that."}
      </p>
    </section>
  );
}
