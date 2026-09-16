export default function TradeOff({
  tension,
  resolution,
}: {
  tension: string;
  resolution: string;
}) {
  return (
    <div className="rounded-sm border border-dashed border-brass/50 bg-brass/[0.05] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brass">
        Honest trade-off
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-secondary sm:text-base">
        {tension}
      </p>
      <p className="mt-3 text-sm leading-relaxed sm:text-base">
        <span className="font-semibold text-ink">Resolution: </span>
        <span className="text-ink-secondary">{resolution}</span>
      </p>
    </div>
  );
}
