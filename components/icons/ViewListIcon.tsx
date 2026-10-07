type ViewListIconProps = {
  className?: string;
};

/** Google Material Symbols "view_list" glyph. */
export default function ViewListIcon({ className = "h-4 w-4" }: ViewListIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M3 14h4v-4H3v4zm0 5h4v-4H3v4zM3 9h4V5H3v4zm5 5h13v-4H8v4zm0 5h13v-4H8v4zM8 5v4h13V5H8z" />
    </svg>
  );
}
