export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Considered and set aside */}
      <path
        d="M3 26 L9 30"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="30" r="1.6" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.3" />
      <path
        d="M14 18 L21 23"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="21" cy="23" r="1.6" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.3" />

      {/* The traced decision */}
      <path
        d="M3 26 L14 18 L26 12 L36 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="3" cy="26" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="14" cy="18" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="26" cy="12" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="36" cy="6" r="3.4" fill="currentColor" />
    </svg>
  );
}
