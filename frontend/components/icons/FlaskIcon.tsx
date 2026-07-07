export function FlaskIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 3h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10.5 3v5.2L5.8 17.4C5 19 6.1 21 8 21h8c1.9 0 3-2 2.2-3.6L13.5 8.2V3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 14.5c1.2.9 2.3 1.3 4 1.3s2.8-.4 4-1.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="9" cy="18" r="0.9" fill="currentColor" />
      <circle cx="12.5" cy="19" r="0.6" fill="currentColor" />
    </svg>
  );
}