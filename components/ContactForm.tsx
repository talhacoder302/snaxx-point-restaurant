"use client";

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-[13px] border border-white/10 bg-white/[0.035] px-4 py-3.5 text-[14.5px] text-white placeholder:text-[#666] backdrop-blur-md transition-all duration-300 focus:border-ember/40 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-ember/15";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "");
    formData.append("subject", "New message from Snaxx Point website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[22px] border border-ember/20 bg-ember/[0.05] px-8 text-center backdrop-blur-md">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-ember-light to-ember-dark text-2xl text-ink shadow-[0_14px_35px_rgba(227,167,53,0.25)]">
          ✓
        </span>
        <h3 className="mt-6 font-display text-2xl font-black text-white">
          Message Sent!
        </h3>
        <p className="mt-3 max-w-[320px] text-[14.5px] leading-[1.75] text-smoke">
          Thanks for reaching out. {"We'll"} get back to you as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.035] px-6 text-[13px] font-bold text-white/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/35 hover:bg-ember/[0.06]"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-[12px] font-bold uppercase tracking-[1.5px] text-mist"
          >
            Your Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="mb-2 block text-[12px] font-bold uppercase tracking-[1.5px] text-mist"
          >
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="+92 300 0000000"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="contact-email"
          className="mb-2 block text-[12px] font-bold uppercase tracking-[1.5px] text-mist"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={inputClasses}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="contact-message"
          className="mb-2 block text-[12px] font-bold uppercase tracking-[1.5px] text-mist"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what's on your mind…"
          className={`${inputClasses} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-br from-ember-light to-ember-dark px-7 text-sm font-bold text-ink shadow-[0_14px_35px_rgba(227,167,53,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(227,167,53,0.3)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "submitting" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>

      {status === "error" && (
        <p className="mt-4 text-center text-[13.5px] text-flame">
          Something went wrong sending your message. Please try again, or
          reach out on WhatsApp instead.
        </p>
      )}
    </form>
  );
}