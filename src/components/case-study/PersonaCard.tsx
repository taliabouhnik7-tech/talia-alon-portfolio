import Reveal from "@/components/Reveal";

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
    <Reveal>
      <div className="rounded-[12px] bg-canvas p-6">
        <p className="text-[14px] font-medium text-graphite">
          Persona
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink">{name}</h3>
        {meta ? (
          <p className="mt-1 text-sm text-ink-secondary">{meta}</p>
        ) : null}
        <p className="mt-4 text-base leading-relaxed text-ink-secondary sm:text-[17px]">
          {description}
        </p>
      </div>
    </Reveal>
  );
}
