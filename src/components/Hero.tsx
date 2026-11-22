export default function Hero() {
  return (
    <section id="top" className="mx-auto w-full max-w-[1200px] px-5 pt-14 pb-12 sm:px-8 sm:pt-20 sm:pb-16">
      <div className="flex flex-col gap-8">
        <div>
          <p className="flex items-center gap-2.5 text-[15px] text-graphite-soft">
            <span className="h-2 w-2 rounded-full bg-[#2f9e5b]" />
            Open to UX/UI roles
          </p>
          <h1 className="mt-5 text-[56px] leading-[0.95] font-semibold tracking-[-0.045em] text-graphite sm:text-[88px] lg:text-[112px]">
            Talia Alon
          </h1>
          <p className="mt-3 text-[26px] leading-tight font-medium tracking-[-0.025em] text-graphite-soft sm:text-[34px]">
            UX/UI designer
          </p>
        </div>

        <div className="max-w-[56ch]">
          <p className="text-[18px] leading-[1.6] text-graphite-soft">
            Cognitive science graduate and former math tutor. I research how people think, design
            for it, and when a project needs it, take it all the way to a live product.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#work"
              className="rounded-full bg-graphite px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-black"
            >
              See my work
            </a>
            <a
              href="mailto:taliabouhnik7@gmail.com"
              className="rounded-full border border-graphite/20 px-5 py-2.5 text-[15px] font-medium text-graphite transition-colors hover:border-graphite"
            >
              Email me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
