type ClockIconProps = {
  className?: string;
};

export default function ClockIcon({ className = "h-4 w-4" }: ClockIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.75" />
    </svg>
  );
}
