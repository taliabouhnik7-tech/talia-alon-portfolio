export type Fact = {
  label: string;
  description: string;
};

export default function FactGrid({ facts }: { facts: Fact[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="rounded-sm border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brass">
            {fact.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary sm:text-base">
            {fact.description}
          </p>
        </div>
      ))}
    </div>
  );
}
