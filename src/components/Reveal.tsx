/**
 * Kept as a plain wrapper so existing pages keep working. Sections no longer
 * fade in one by one; the site saves its motion for the process sequence.
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
