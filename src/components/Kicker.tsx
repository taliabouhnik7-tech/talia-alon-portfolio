/** Section heading inside a case study. */
export default function Kicker({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-[22px] leading-tight font-semibold tracking-[-0.02em] text-graphite">{children}</h2>;
}
