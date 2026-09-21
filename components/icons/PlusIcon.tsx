type PlusIconProps = {
  className?: string;
};

/** Google Material Symbols "add" glyph. */
export default function PlusIcon({ className = "h-4 w-4" }: PlusIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}
