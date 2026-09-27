"use client";

import { motion, type Variants } from "framer-motion";
import HeroMark from "@/components/HeroMark";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="bg-grain relative overflow-hidden"
      style={{
        background:
          "radial-gradient(130% 110% at 80% 10%, var(--color-brand-glow-soft) 0%, var(--color-brand-mid) 38%, var(--color-brand-deep) 78%)",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pt-14 pb-16 sm:px-8 sm:pt-20 sm:pb-20 lg:grid-cols-[1fr_360px] lg:items-center lg:gap-16 lg:pb-28"
      >
        <div className="max-w-2xl">
          <motion.div variants={item} className="lg:hidden">
            <HeroMark className="mb-8 h-32 w-32 text-brand-glow" />
          </motion.div>

          <motion.h1
            variants={item}
            className="font-serif text-4xl leading-[1.1] tracking-tight text-brand-ink sm:text-5xl md:text-6xl"
          >
            Design decisions you can trace, all the way to production.
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink/75 sm:text-xl"
          >
            UX/UI designer with a background in cognitive science. I research,
            design — and when it matters, I take the thing all the way to a
            live product myself.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#work"
              className="inline-flex items-center justify-center rounded-sm bg-brand-glow px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:brightness-110"
            >
              See selected work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-sm border border-brand-ink/30 px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-glow hover:text-brand-glow"
            >
              Get in touch
            </a>
          </motion.div>
          <motion.p
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium uppercase tracking-[0.1em] text-brand-ink/60"
          >
            <span>Based in Hadera, Israel</span>
            <span className="text-brand-glow">·</span>
            <span>Open to UX/UI roles</span>
            <span className="text-brand-glow">·</span>
            <span>Figma</span>
            <span className="text-brand-glow">·</span>
            <span>Design Systems</span>
            <span className="text-brand-glow">·</span>
            <span>RTL</span>
            <span className="text-brand-glow">·</span>
            <span>Mobile-first</span>
          </motion.p>
        </div>

        <motion.div variants={item} className="hidden lg:block">
          <HeroMark className="h-80 w-80 text-brand-glow" />
        </motion.div>
      </motion.div>
    </section>
  );
}
