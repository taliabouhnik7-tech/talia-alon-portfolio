import Reveal from "@/components/Reveal";

export default function TradeOff({
  tension,
  resolution,
}: {
  tension: string;
  resolution: string;
}) {
  return (
    <Reveal>
      <div className="rounded-[12px] border border-dashed border-border-strong bg-frame p-6 sm:p-8">
        <p className="text-[14px] font-medium text-graphite">
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
    </Reveal>
  );
}
