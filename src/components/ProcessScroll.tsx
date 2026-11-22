"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Kicker from "@/components/Kicker";

/**
 * Scroll-scrubbed "exploded view" of one real screen — the Talia Alon Bakery
 * ordering page — going from sketch → structure → interface → production.
 * The scroll position *is* the timeline: scrub down and the screen is built,
 * scrub up and it's taken apart again.
 */

const steps = [
  {
    n: "01",
    label: "Research",
    title: "It starts as a question, not a screen.",
    body: "Rough sketches from interviews and observation — what people actually need before anything gets pixels.",
    range: [0, 0.24] as const,
  },
  {
    n: "02",
    label: "Structure",
    title: "Then I take it apart.",
    body: "Layout, components, content and interactions as separate layers — each one a decision I can explain.",
    range: [0.24, 0.5] as const,
  },
  {
    n: "03",
    label: "Interface",
    title: "Put back together, with intent.",
    body: "Visual design built on a system: type, color and hierarchy that serve the task, not decoration.",
    range: [0.5, 0.76] as const,
  },
  {
    n: "04",
    label: "Production",
    title: "And shipped — for real.",
    body: "This exact screen is live. Real customers order from it, and I directed it into production myself.",
    range: [0.76, 1] as const,
  },
];

export default function ProcessScroll() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Light smoothing so the scrub feels physical, like scrubbing video.
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  if (reduce) return <ProcessStatic />;

  return (
    <section
      id="process"
      ref={ref}
      className="relative"
      style={{ height: "460vh" }}
      aria-label="How I work: from research to production"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <BackdropGlow p={p} />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-4 px-5 pt-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pt-0">
          {/* Captions */}
          <div className="relative min-w-0">
            <Kicker>How I work</Kicker>
            <StepIndex p={p} />
            <div className="relative mt-5 h-[140px] sm:h-[170px] lg:h-[220px]">
              {steps.map((s, i) => (
                <Caption key={s.n} step={s} index={i} p={p} />
              ))}
            </div>
            <ProgressLine p={p} />
          </div>

          {/* The exploded screen */}
          <div className="mt-6 flex justify-center lg:mt-0">
            <ExplodedPhone p={p} />
          </div>
        </div>

        <ScrollHint p={p} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function BackdropGlow({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["20%", "80%"]);
  const opacity = useTransform(p, [0, 0.5, 1], [0.35, 0.6, 0.45]);
  const background = useTransform(
    x,
    (v) =>
      `radial-gradient(60% 55% at ${v} 50%, var(--color-brand-glow-soft) 0%, transparent 70%)`
  );
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background, opacity }}
    />
  );
}

function StepIndex({ p }: { p: MotionValue<number> }) {
  return (
    <ol className="flex flex-wrap gap-2 sm:gap-3">
      {steps.map((s) => (
        <StepPill key={s.n} step={s} p={p} />
      ))}
    </ol>
  );
}

function StepPill({ step, p }: { step: (typeof steps)[number]; p: MotionValue<number> }) {
  const [a, b] = step.range;
  const active = useTransform(p, (v) => (v >= a && (v < b || b === 1) ? 1 : 0));
  const done = useTransform(p, (v) => (v >= b ? 1 : 0));
  const color = useTransform([active, done] as MotionValue<number>[], ([ac, d]) =>
    ac ? "var(--color-brand-glow)" : d ? "rgba(185,166,255,0.55)" : "rgba(247,244,237,0.3)"
  );
  const borderColor = useTransform(active, (v) =>
    v ? "var(--color-brand-glow)" : "rgba(185,166,255,0.18)"
  );
  return (
    <motion.li
      className="whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] sm:px-3 sm:text-[11px] font-semibold uppercase tracking-[0.12em]"
      style={{ color, borderColor }}
    >
      <span className="hidden 2xl:inline">{step.n} · </span>
      {step.label}
    </motion.li>
  );
}

function Caption({
  step,
  index,
  p,
}: {
  step: (typeof steps)[number];
  index: number;
  p: MotionValue<number>;
}) {
  const [a, b] = step.range;
  const fade = 0.04;
  const first = index === 0;
  const last = index === steps.length - 1;
  const opacity = useTransform(
    p,
    [a - fade, a + fade, b - fade, b + fade],
    [first ? 1 : 0, 1, 1, last ? 1 : 0]
  );
  const y = useTransform(
    p,
    [a - fade, a + fade, b - fade, b + fade],
    [first ? 0 : 30, 0, 0, last ? 0 : -30]
  );
  const filter = useTransform(opacity, (o) => `blur(${(1 - o) * 6}px)`);

  return (
    <motion.div className="absolute inset-0" style={{ opacity, y, filter }}>
      <h2 className="font-serif text-3xl leading-[1.12] tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
        {step.title}
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-brand-ink/70 sm:text-lg">
        {step.body}
      </p>
    </motion.div>
  );
}

function ProgressLine({ p }: { p: MotionValue<number> }) {
  return (
    <div className="mt-6 hidden h-px w-full max-w-md bg-brand-ink/10 lg:block">
      <motion.div
        className="h-px origin-left bg-brand-glow"
        style={{ scaleX: p }}
      />
    </div>
  );
}

function ScrollHint({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0, 0.05], [1, 0]);
  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-ink/50"
    >
      <motion.span
        className="block"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll ↓
      </motion.span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* The phone + its layers                                              */
/* ------------------------------------------------------------------ */

const layerLabels = ["Layout grid", "Components", "Content", "Interactions"];

function ExplodedPhone({ p }: { p: MotionValue<number> }) {
  // Explode between 0.26–0.38, hold, recompose 0.6–0.74.
  const explode = useTransform(p, [0.26, 0.38, 0.6, 0.74], [0, 1, 1, 0]);
  const rotateX = useTransform(explode, [0, 1], [0, 58]);
  const rotateZ = useTransform(explode, [0, 1], [0, -32]);
  const scale = useTransform(explode, [0, 1], [1, 0.78]);
  const spread = useTransform(explode, [0, 1], [0, 64]);

  // Final "live" lift
  const liftY = useTransform(p, [0.76, 0.86], [0, -8]);
  const glow = useTransform(p, [0.76, 0.88], [0, 1]);
  const shadow = useTransform(
    glow,
    (g) => `0 30px 80px -20px rgba(109,84,201,${0.25 + g * 0.45}), 0 0 ${g * 60}px rgba(185,166,255,${g * 0.35})`
  );

  return (
    <div
      className="relative h-[360px] w-[180px] sm:h-[500px] sm:w-[250px] lg:h-[560px] lg:w-[280px]"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ rotateX, rotateZ, scale, y: liftY, transformStyle: "preserve-3d" }}
      >
        {/* Device frame (the base layer) */}
        <motion.div
          className="absolute inset-0 rounded-[2.2rem] border border-brand-glow/25 bg-[#120b26]"
          style={{ boxShadow: shadow, transformStyle: "preserve-3d" }}
        >
          <SketchLayer p={p} />
        </motion.div>

        <Layer index={1} spread={spread}>
          <WireframeLayer p={p} />
        </Layer>
        <Layer index={2} spread={spread}>
          <ComponentsLayer p={p} />
        </Layer>
        <Layer index={3} spread={spread}>
          <ContentLayer p={p} />
        </Layer>
        <Layer index={4} spread={spread}>
          <InteractionLayer p={p} />
        </Layer>

        {/* Layer labels — only while exploded */}
        {layerLabels.map((label, i) => (
          <LayerLabel key={label} label={label} index={i + 1} spread={spread} explode={explode} />
        ))}
      </motion.div>
    </div>
  );
}

function Layer({
  index,
  spread,
  children,
}: {
  index: number;
  spread: MotionValue<number>;
  children: React.ReactNode;
}) {
  const z = useTransform(spread, (s) => s * index);
  const border = useTransform(spread, (s) => `rgba(185,166,255,${Math.min(s / 64, 1) * 0.35})`);
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[2.2rem] border"
      style={{ z, borderColor: border }}
    >
      {children}
    </motion.div>
  );
}

function LayerLabel({
  label,
  index,
  spread,
  explode,
}: {
  label: string;
  index: number;
  spread: MotionValue<number>;
  explode: MotionValue<number>;
}) {
  const z = useTransform(spread, (s) => s * index);
  const opacity = useTransform(explode, [0.6, 1], [0, 1]);
  return (
    <motion.div
      className="absolute -right-4 top-6 translate-x-full whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-glow sm:text-[11px]"
      style={{ z, opacity }}
    >
      <span className="mr-2 inline-block h-px w-6 bg-brand-glow/60 align-middle" />
      {label}
    </motion.div>
  );
}

/* Step 1 — hand-drawn sketch strokes that draw in with scroll */
function SketchLayer({ p }: { p: MotionValue<number> }) {
  const draw = useTransform(p, [0.02, 0.2], [0, 1]);
  const opacity = useTransform(p, [0.24, 0.34], [1, 0]);
  const paths = [
    "M30 58 C 80 54, 150 60, 200 56", // header
    "M28 90 C 26 140, 30 170, 28 200 C 90 204, 160 198, 222 202 C 224 160, 220 120, 222 92 C 160 88, 90 94, 28 90", // hero image
    "M30 236 C 70 232, 110 238, 140 234", // title
    "M30 252 C 60 250, 90 254, 110 251",
    "M28 280 C 27 320, 30 340, 28 360 C 60 362, 90 358, 118 360 C 120 330, 117 300, 119 282 C 90 279, 60 283, 28 280", // card 1
    "M132 280 C 131 320, 134 340, 132 360 C 164 362, 194 358, 222 360 C 224 330, 221 300, 223 282 C 194 279, 164 283, 132 280", // card 2
    "M40 400 C 90 396, 160 402, 210 398 C 212 412, 210 420, 212 430 C 160 434, 90 428, 40 432 C 38 420, 40 410, 40 400", // CTA
    "M60 120 L190 180 M190 120 L60 180", // image X
  ];
  return (
    <motion.svg
      viewBox="0 0 250 500"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      style={{ opacity }}
      fill="none"
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#f7f4ed"
          strokeOpacity={0.7}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeDasharray={i === paths.length - 1 ? "4 5" : undefined}
          style={{ pathLength: draw }}
        />
      ))}
      <motion.text
        x="40"
        y="472"
        fill="#cba668"
        fontSize="12"
        fontStyle="italic"
        style={{ opacity: draw }}
      >
        what do they need?
      </motion.text>
    </motion.svg>
  );
}

/* Step 2a — the grid / wireframe */
function WireframeLayer({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.2, 0.3, 0.66, 0.76], [0, 1, 1, 0]);
  return (
    <motion.div className="absolute inset-0 p-[11%]" style={{ opacity }}>
      <div className="grid h-full grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-full bg-brand-glow/[0.07]" />
        ))}
      </div>
    </motion.div>
  );
}

/* Step 2b/3 — components: grey wireframe blocks that gain color */
function ComponentsLayer({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.22, 0.3], [0, 1]);
  const colorize = useTransform(p, [0.5, 0.64], [0, 1]);
  const heroBg = useTransform(
    colorize,
    [0, 1],
    ["rgba(247,244,237,0.08)", "rgba(203,166,104,0.9)"]
  );
  const cardBg = useTransform(colorize, [0, 1], ["rgba(247,244,237,0.06)", "rgba(36,21,87,1)"]);
  const ctaBg = useTransform(colorize, [0, 1], ["rgba(247,244,237,0.12)", "rgba(185,166,255,1)"]);
  const screenBg = useTransform(colorize, [0, 1], ["rgba(18,11,38,0)", "rgba(18,11,38,1)"]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity, backgroundColor: screenBg }}>
      <div className="absolute inset-x-[11%] top-[17%] h-[23%] overflow-hidden rounded-xl">
        <motion.div className="h-full w-full" style={{ backgroundColor: heroBg }} />
        <Pastry colorize={colorize} />
      </div>
      <motion.div
        className="absolute left-[11%] top-[56%] h-[16%] w-[36%] rounded-lg"
        style={{ backgroundColor: cardBg }}
      />
      <motion.div
        className="absolute right-[11%] top-[56%] h-[16%] w-[36%] rounded-lg"
        style={{ backgroundColor: cardBg }}
      />
      <motion.div
        className="absolute inset-x-[16%] top-[80%] h-[6.5%] rounded-full"
        style={{ backgroundColor: ctaBg }}
      />
    </motion.div>
  );
}

function Pastry({ colorize }: { colorize: MotionValue<number> }) {
  return (
    <motion.svg
      viewBox="0 0 120 60"
      className="absolute inset-0 m-auto h-[80%] w-[80%]"
      style={{ opacity: colorize }}
      fill="none"
    >
      {/* rolled pastries */}
      {[30, 60, 90].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} ${32 + (i === 1 ? -4 : 0)})`}>
          <circle r="14" fill="#7a4a24" />
          <path
            d="M0 0 m-9 0 a9 9 0 1 0 9 -9 a6 6 0 1 0 6 6 a3 3 0 1 0 -3 3"
            stroke="#f2d7a6"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      ))}
    </motion.svg>
  );
}

/* Step 2c/3 — content: text skeletons become real copy */
function ContentLayer({ p }: { p: MotionValue<number> }) {
  const skeleton = useTransform(p, [0.24, 0.32, 0.56, 0.64], [0, 1, 1, 0]);
  const real = useTransform(p, [0.56, 0.66], [0, 1]);
  return (
    <div className="absolute inset-0 text-brand-ink">
      {/* Skeleton lines */}
      <motion.div className="absolute inset-0" style={{ opacity: skeleton }}>
        <div className="absolute left-[11%] top-[8%] h-2 w-[40%] rounded bg-brand-ink/25" />
        <div className="absolute left-[11%] top-[44%] h-2.5 w-[55%] rounded bg-brand-ink/25" />
        <div className="absolute left-[11%] top-[49%] h-2 w-[35%] rounded bg-brand-ink/15" />
        <div className="absolute left-[15%] top-[74%] h-1.5 w-[22%] rounded bg-brand-ink/20" />
        <div className="absolute right-[15%] top-[74%] h-1.5 w-[22%] rounded bg-brand-ink/20" />
      </motion.div>

      {/* Real content */}
      <motion.div className="absolute inset-0" style={{ opacity: real }}>
        <div className="absolute inset-x-[11%] top-[6.5%] flex items-center justify-between">
          <span className="font-serif text-[13px] sm:text-[15px]">Talia Alon Bakery</span>
          <span className="text-[13px]">☰</span>
        </div>
        <p className="absolute left-[11%] top-[42.5%] font-serif text-[15px] leading-tight sm:text-[17px]">
          Rolled, baked, delivered.
        </p>
        <p className="absolute left-[11%] top-[48.5%] text-[10px] text-brand-ink/60 sm:text-[11px]">
          Fresh boxes · dairy &amp; parve
        </p>
        <div className="absolute left-[13%] top-[58%] w-[32%] text-[10px] leading-snug sm:text-[11px]">
          <p className="font-semibold">Kinder rolls</p>
          <p className="text-brand-ink/60">Box of 7</p>
          <p className="mt-1 text-brand-glow">₪40</p>
        </div>
        <div className="absolute right-[13%] top-[58%] w-[32%] text-[10px] leading-snug sm:text-[11px]">
          <p className="font-semibold">Nutella rolls</p>
          <p className="text-brand-ink/60">Box of 7</p>
          <p className="mt-1 text-brand-glow">₪40</p>
        </div>
        <p className="absolute inset-x-[16%] top-[81.3%] text-center text-[11px] font-semibold text-brand-deep sm:text-[12px]">
          Order a box
        </p>
      </motion.div>
    </div>
  );
}

/* Step 4 — live: a tap, a cart badge, a confirmation, a deployed URL */
function InteractionLayer({ p }: { p: MotionValue<number> }) {
  const hotspots = useTransform(p, [0.3, 0.36, 0.6, 0.66], [0, 1, 1, 0]);
  const tap = useTransform(p, [0.8, 0.84, 0.88], [0, 1, 0]);
  const tapScale = useTransform(p, [0.8, 0.88], [0.4, 2.2]);
  const toast = useTransform(p, [0.86, 0.9], [0, 1]);
  const toastY = useTransform(p, [0.86, 0.9], [16, 0]);
  const badge = useTransform(p, [0.85, 0.88], [0, 1]);
  const url = useTransform(p, [0.9, 0.95], [0, 1]);

  return (
    <div className="absolute inset-0">
      {/* Interaction hotspots while exploded */}
      <motion.div className="absolute inset-0" style={{ opacity: hotspots }}>
        {[
          ["84%", "7%"],
          ["50%", "83%"],
          ["29%", "64%"],
          ["71%", "64%"],
        ].map(([left, top]) => (
          <span
            key={left + top}
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brass"
            style={{ left, top }}
          />
        ))}
      </motion.div>

      {/* Tap ripple on the CTA */}
      <motion.span
        className="absolute left-1/2 top-[83.2%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
        style={{ opacity: tap, scale: tapScale }}
      />

      {/* Cart badge */}
      <motion.span
        className="absolute right-[8%] top-[4.5%] flex h-4 w-4 items-center justify-center rounded-full bg-brass text-[9px] font-bold text-brand-deep"
        style={{ opacity: badge, scale: badge }}
      >
        1
      </motion.span>

      {/* Order toast */}
      <motion.div
        className="absolute inset-x-[9%] top-[89%] flex items-center gap-2 rounded-lg bg-brand-ink px-3 py-2 text-[10px] font-semibold text-brand-deep sm:text-[11px]"
        style={{ opacity: toast, y: toastY }}
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[9px] text-white">
          ✓
        </span>
        Order received — thank you!
      </motion.div>

      {/* Deployed URL chip, outside-top */}
      <motion.div
        className="absolute inset-x-0 -top-0 flex justify-center pt-2"
        style={{ opacity: url }}
      >
        <span className="rounded-full border border-brand-glow/40 bg-brand-deep/90 px-2.5 py-0.5 text-[9px] font-medium text-brand-glow">
          ● live · vercel.app
        </span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ProcessStatic() {
  return (
    <section id="process" className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
      <Kicker>How I work</Kicker>
      <ol className="mt-6 grid gap-8 sm:grid-cols-2">
        {steps.map((s) => (
          <li key={s.n}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-glow">
              {s.n} · {s.label}
            </p>
            <h3 className="mt-2 font-serif text-2xl text-ink">{s.title}</h3>
            <p className="mt-2 text-ink-secondary">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
