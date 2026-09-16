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
    <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
      {title ? (
        <h3 className="mb-4 font-serif text-xl text-ink sm:text-2xl">
          {title}
        </h3>
      ) : null}
      <div className="space-y-4 text-sm leading-relaxed sm:text-base">
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
  );
}
