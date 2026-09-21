"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import WhatsAppIcon from "./icons/WhatsAppIcon";

/** Fixed bottom-right WhatsApp button, shown on every public page. */
export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // The admin dashboard is for staff, not customers.
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={buildWhatsAppOrderLink("a meal")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full sm:bottom-7 sm:right-7"
    >
      {/* Pulsing rings */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] animate-wa-ring motion-reduce:hidden"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] animate-wa-ring [animation-delay:1.2s] motion-reduce:hidden"
      />

      <span className="relative grid place-items-center rounded-full shadow-[0_10px_28px_rgba(29,168,81,0.45)] animate-wa-wiggle motion-reduce:animate-none">
        <WhatsAppIcon circle className="h-8 w-8" circleClassName="h-14 w-14" />
      </span>
    </a>
  );
}
