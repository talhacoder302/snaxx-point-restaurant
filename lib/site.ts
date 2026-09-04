export const site = {
  name: "Snaxx Point",
  tagline: "Every Bite, Pure Delight!",
  phoneDisplay: "+92 300 8505528",
  phoneHref: "tel:+923008505528",
  email: "snaxxpointrestaurant@gmail.com",
  emailHref: "mailto:snaxxpointrestaurant@gmail.com",
  /**
   * Centralized WhatsApp number (international format, no "+" or spaces).
   * Change this ONE value to update WhatsApp ordering across the entire website.
   */
  whatsappNumber: "923008505528",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;