export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 26 L14 18 L24 22 L36 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="3" cy="26" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="14" cy="18" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="24" cy="22" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="36" cy="6" r="3.4" fill="currentColor" />
    </svg>
  );
}
