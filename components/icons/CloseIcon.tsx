type CloseIconProps = {
  className?: string;
};

/** Google Material Symbols "close" glyph. */
export default function CloseIcon({ className = "h-4 w-4" }: CloseIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}
