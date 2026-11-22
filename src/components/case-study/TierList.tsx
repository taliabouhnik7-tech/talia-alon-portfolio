import Reveal from "@/components/Reveal";

export type Tier = {
  label: string;
  items: string[];
};

export default function TierList({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiers.map((tier, i) => (
        <Reveal key={tier.label} delay={i * 0.08}>
          <div className="rounded-[12px] bg-canvas p-5">
            <p className="text-[14px] font-medium text-graphite">
              {tier.label}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
              {tier.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
