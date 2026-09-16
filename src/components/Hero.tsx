export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
      <div className="max-w-3xl">
        <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
          Design decisions you can trace, all the way to production.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary sm:text-xl">
          UX/UI designer with a background in cognitive science. I research,
          design — and when it matters, I take the thing all the way to a
          live product myself.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#work"
            className="inline-flex items-center justify-center rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent-strong"
          >
            See selected work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-sm border border-border-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>
        <p className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium uppercase tracking-[0.1em] text-ink-secondary">
          <span>Based in Hadera, Israel</span>
          <span className="text-brass">·</span>
          <span>Open to UX/UI roles</span>
          <span className="text-brass">·</span>
          <span>Figma</span>
          <span className="text-brass">·</span>
          <span>Design Systems</span>
          <span className="text-brass">·</span>
          <span>RTL</span>
          <span className="text-brass">·</span>
          <span>Mobile-first</span>
        </p>
      </div>
    </section>
  );
}
