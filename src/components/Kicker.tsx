export default function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
      {children}
    </p>
  );
}
