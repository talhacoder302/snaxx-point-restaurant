type ArrowBackIconProps = {
  className?: string;
};

/** Google Material Symbols "arrow_back" glyph. */
export default function ArrowBackIcon({ className = "h-4 w-4" }: ArrowBackIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}
