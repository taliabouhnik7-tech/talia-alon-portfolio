export type Tier = {
  label: string;
  items: string[];
};

export default function TierList({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiers.map((tier) => (
        <div key={tier.label} className="rounded-sm border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brass">
            {tier.label}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
            {tier.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
