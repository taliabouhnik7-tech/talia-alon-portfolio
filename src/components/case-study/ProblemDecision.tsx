import Reveal from "@/components/Reveal";

export default function ProblemDecision({
  title,
  problem,
  decision,
  why,
}: {
  title?: string;
  problem: string;
  decision: string;
  why?: string;
}) {
  return (
    <Reveal>
      <div className="rounded-[12px] bg-canvas p-6 sm:p-8">
        {title ? (
          <h3 className="mb-4 text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
            {title}
          </h3>
        ) : null}
        <div className="space-y-4 text-base leading-relaxed sm:text-[17px]">
          <p>
            <span className="font-semibold text-ink">Problem: </span>
            <span className="text-ink-secondary">{problem}</span>
          </p>
          <p>
            <span className="font-semibold text-ink">Decision: </span>
            <span className="text-ink-secondary">{decision}</span>
          </p>
          {why ? (
            <p>
              <span className="font-semibold text-ink">Why: </span>
              <span className="text-ink-secondary">{why}</span>
            </p>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
