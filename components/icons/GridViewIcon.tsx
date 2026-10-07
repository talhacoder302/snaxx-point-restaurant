type GridViewIconProps = {
  className?: string;
};

/** Google Material Symbols "grid_view" glyph. */
export default function GridViewIcon({ className = "h-4 w-4" }: GridViewIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" />
    </svg>
  );
}
