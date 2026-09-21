type MinusIconProps = {
  className?: string;
};

/** Google Material Symbols "remove" glyph. */
export default function MinusIcon({ className = "h-4 w-4" }: MinusIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19 13H5v-2h14v2z" />
    </svg>
  );
}
