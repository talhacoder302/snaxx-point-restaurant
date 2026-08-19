export const site = {
  name: "Snaxx Point",
  tagline: "Every Bite, Pure Delight!",
  phoneDisplay: "+92 325 0062540",
  phoneHref: "tel:+923250062540",
  email: "snaxxpointrestaurant@gmail.com",
  emailHref: "mailto:snaxxpointrestaurant@gmail.com",
  /**
   * Centralized WhatsApp number (international format, no "+" or spaces).
   * Change this ONE value to update WhatsApp ordering across the entire website.
   */
  whatsappNumber: "923250062540",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/contact" },
] as const;