import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import Reveal from "./Reveal";

const steps = [
  {
    icon: "📋",
    title: "Browse The Menu",
    description: "Check out our offers and pick whatever's calling your name.",
  },
  {
    icon: <WhatsAppIcon className="h-6 w-6" />,
    title: "Message Us On WhatsApp",
    description: "Tap Order Now — your request lands with us instantly, no app needed.",
  },
  {
    icon: "🍽️",
    title: "Sit Back & Enjoy",
    description: "We fire it up fresh and get it ready for you, just like that.",
  },
];

export default function HowToOrder() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[2px] text-ember-light">
            How It Works
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
            Ordering, Made
            <span className="block text-gradient">Ridiculously Simple</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[15.5px] leading-[1.8] text-white/55">
            No accounts, no apps to download — just three easy steps between
            you and your next meal.
          </p>
        </Reveal>

        <div className="relative mt-16">
          {/* Connecting line behind the steps, desktop only */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block"
          />

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 120}>
                <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-ember/25 bg-ember/10 text-xl font-black text-ember-light shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
                    {index + 1}
                  </span>

                  <span aria-hidden="true" className="mt-5 text-2xl">
                    {step.icon}
                  </span>

                  <h3 className="mt-2 text-lg font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2.5 max-w-[300px] text-[14.5px] leading-[1.75] text-white/55">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={360} className="mt-14 flex justify-center">
          <a
            href={buildWhatsAppOrderLink("a meal")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-ember px-7 text-sm font-bold text-white shadow-[0_14px_35px_rgba(228,0,43,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark hover:shadow-[0_18px_42px_rgba(228,0,43,0.4)]"
          >
            <WhatsAppIcon circle className="h-4 w-4" circleClassName="h-8 w-8" />
            Start An Order
          </a>
        </Reveal>
      </div>
    </section>
  );
}
