import Reveal from "@/components/Reveal";

export type Fact = {
  label: string;
  description: string;
};

export default function FactGrid({ facts }: { facts: Fact[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {facts.map((fact, i) => (
        <Reveal key={fact.label} delay={(i % 2) * 0.08}>
          <div className="rounded-[12px] bg-canvas p-5">
            <p className="text-[14px] font-medium text-graphite">
              {fact.label}
            </p>
            <p className="mt-2 text-base leading-relaxed text-ink-secondary sm:text-[17px]">
              {fact.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
