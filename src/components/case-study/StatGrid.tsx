import Reveal from "@/components/Reveal";

export type Stat = {
  value: string;
  label: string;
};

export default function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={(i % 4) * 0.06}>
          <div className="rounded-[12px] bg-canvas p-5">
            <p className="text-3xl font-semibold tracking-[-0.02em] text-accent">{stat.value}</p>
            <p className="mt-2 text-sm leading-snug text-ink-secondary">
              {stat.label}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
