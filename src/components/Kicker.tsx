/** Small section label. Sentence case, quiet — it names, it doesn't shout. */
export default function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[15px] font-medium text-graphite-soft">{children}</p>;
}
