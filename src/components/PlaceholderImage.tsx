export default function PlaceholderImage({
  label = "Screenshot pending",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex aspect-[4/3] w-full items-center justify-center border border-dashed border-border-strong bg-card ${className}`}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brass"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="9" cy="10.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M4 17l5-5 3.5 3.5L16 12l4 5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-secondary">
          {label}
        </span>
      </div>
    </div>
  );
}
