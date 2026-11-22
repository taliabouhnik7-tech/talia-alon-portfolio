const facts = [
  {
    label: "Background",
    value: "B.Sc. in Cognitive & Brain Sciences, Ben Gurion University",
  },
  {
    label: "Craft",
    value: "Research, interaction design, design systems, RTL and mobile",
  },
  {
    label: "Shipped",
    value: "A live ordering site for my own bakery, designed and built by me",
  },
];

export default function Hero() {
  return (
    <section id="top" className="mx-auto w-full max-w-[1200px] px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
      <p className="flex items-center gap-2.5 text-[15px] text-graphite-soft">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-[#2f9e5b]" />
        </span>
        UX/UI designer in Hadera, open to new roles
      </p>

      <h1 className="mt-6 max-w-[15ch] text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] text-graphite sm:text-[68px] lg:text-[88px]">
        I design products around how people actually think.
      </h1>

      <p className="mt-8 max-w-[56ch] text-lg leading-[1.6] text-graphite-soft sm:text-xl">
        I studied cognitive science and spent years teaching math one on one.
        Now I use both in research and interface design, and when a project
        needs it, I build the product myself.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href="#work"
          className="rounded-full bg-graphite px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-black"
        >
          See my work
        </a>
        <a
          href="mailto:taliabouhnik7@gmail.com"
          className="rounded-full border border-graphite/25 px-6 py-3 text-[15px] font-medium text-graphite transition-colors hover:border-graphite"
        >
          Email me
        </a>
      </div>

      <dl className="mt-20 grid gap-8 border-t border-rule pt-6 sm:grid-cols-3 sm:gap-10">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-[15px] text-graphite-soft">{f.label}</dt>
            <dd className="mt-1.5 max-w-[30ch] text-[17px] leading-snug text-graphite">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
