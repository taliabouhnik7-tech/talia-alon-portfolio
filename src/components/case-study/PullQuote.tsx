import Reveal from "@/components/Reveal";

export default function PullQuote({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "brass";
}) {
  const borderClass = tone === "accent" ? "border-accent" : "border-brass";
  return (
    <Reveal>
      <div className={`border-l-2 ${borderClass} pl-6`}>
        <p className="text-xl font-semibold tracking-[-0.02em] leading-relaxed text-ink sm:text-2xl">
          {children}
        </p>
      </div>
    </Reveal>
  );
}
