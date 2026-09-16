export default function PersonaCard({
  name,
  meta,
  description,
}: {
  name: string;
  meta?: string;
  description: string;
}) {
  return (
    <div className="rounded-sm border border-border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brass">
        Persona
      </p>
      <h3 className="mt-2 font-serif text-2xl text-ink">{name}</h3>
      {meta ? (
        <p className="mt-1 text-sm text-ink-secondary">{meta}</p>
      ) : null}
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary sm:text-base">
        {description}
      </p>
    </div>
  );
}
