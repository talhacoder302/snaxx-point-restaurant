type ChevronDownIconProps = {
  className?: string;
};

/** Google Material Symbols "keyboard_arrow_down" glyph. */
export default function ChevronDownIcon({ className = "h-4 w-4" }: ChevronDownIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </svg>
  );
}
