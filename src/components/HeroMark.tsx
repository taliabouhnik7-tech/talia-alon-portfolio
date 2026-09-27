export default function HeroMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        pathLength="100"
        d="M14 130 L70 90 L120 110 L186 30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hero-mark-path"
      />
      <circle
        cx="14"
        cy="130"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="hero-mark-node"
        style={{ animationDelay: "0.05s" }}
      />
      <circle
        cx="70"
        cy="90"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="hero-mark-node"
        style={{ animationDelay: "0.55s" }}
      />
      <circle
        cx="120"
        cy="110"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="hero-mark-node"
        style={{ animationDelay: "0.95s" }}
      />
      <circle
        cx="186"
        cy="30"
        r="8"
        fill="currentColor"
        className="hero-mark-final"
        style={{ animationDelay: "1.5s" }}
      />
    </svg>
  );
}
