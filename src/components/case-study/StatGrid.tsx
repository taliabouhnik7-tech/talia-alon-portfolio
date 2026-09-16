export type Stat = {
  value: string;
  label: string;
};

export default function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-sm border border-border bg-card p-5"
        >
          <p className="font-serif text-3xl text-accent">{stat.value}</p>
          <p className="mt-2 text-sm leading-snug text-ink-secondary">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
