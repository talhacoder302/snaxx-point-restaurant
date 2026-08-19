import Reveal from "./Reveal";

export default function NowOpen() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ember/[0.08] bg-ember/[0.03] blur-2xl"
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-ember/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-ember-light">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e3a735] animate-pulse-dot" />
            Now Open
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-7 font-display text-[clamp(2.4rem,5vw,4rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
            {"We're Open"}
            <span className="block text-gradient">& Ready To Serve</span>
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.8] text-smoke">
            Our doors are open and the kitchen is firing. From fresh
            ingredients to bold flavours, every dish is crafted with care —
            come taste the difference today.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className="h-2 w-2 rounded-full bg-ember shadow-[0_0_12px_#e3a735] animate-pulse-dot" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-mist">
              Serving Fresh Daily
            </span>
            <span className="h-2 w-2 rounded-full bg-flame shadow-[0_0_12px_#9b2e1b] animate-pulse-dot [animation-delay:0.4s]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}