export default function PullQuote({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "brass";
}) {
  const borderClass = tone === "accent" ? "border-accent" : "border-brass";
  return (
    <div className={`border-l-2 ${borderClass} pl-6`}>
      <p className="font-serif text-xl leading-relaxed text-ink sm:text-2xl">
        {children}
      </p>
    </div>
  );
}
