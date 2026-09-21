type CheckIconProps = {
  className?: string;
};

/** Google Material Symbols "check" glyph. */
export default function CheckIcon({ className = "h-4 w-4" }: CheckIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}
