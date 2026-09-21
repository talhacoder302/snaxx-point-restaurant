const NUMBER_PATTERN = /\d[\d,]*(?:\.\d+)?/g;

/**
 * Prices are free text entered in the admin ("1099", "Rs. 3749", "Rs. 2,999").
 * Returns the numeric amount, or null when the text has no number or more than
 * one (e.g. "Small 300 / Large 450") — better to show no total than a wrong one.
 */
export function parsePrice(text: string): number | null {
  const matches = text.match(NUMBER_PATTERN);
  if (!matches || matches.length !== 1) return null;

  const value = Number(matches[0].replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
