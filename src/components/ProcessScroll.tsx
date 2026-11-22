"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/*
 * One pinned, scroll-scrubbed sequence: a phone turns toward you, comes
 * apart into its design layers (like an exploded product shot), turns slowly
 * while each layer is selected in a Layers panel, then snaps back together
 * and the screen is used. Scroll is the timeline.
 */

const SCREEN_W = 366;
const SCREEN_H = 820;
const BEZEL = 12;
const DEVICE_W = SCREEN_W + BEZEL * 2;
const DEVICE_H = SCREEN_H + BEZEL * 2;
const COBALT = "#3552f2";

// Bottom to top in the stack.
const LAYERS = ["Sketch", "Grid", "Components", "Content", "Visual"] as const;
const SELECT_START = 0.34;
const SELECT_END = 0.6;

const captions = [
  {
    title: "Every screen is a stack of decisions.",
    body: "Scroll to take one apart.",
    range: [0, 0.16] as const,
  },
  {
    title: "I design each layer on purpose.",
    body: "Sketch, grid, components, content and visual. Each one has a reason to be there, and I can walk you through it.",
    range: [0.16, 0.66] as const,
  },
  {
    title: "Then it goes back together and ships.",
    body: "Research, design and, when the project needs it, the build.",
    range: [0.66, 1] as const,
  },
];

export default function ProcessScroll() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 180, damping: 32, mass: 0.3 });

  if (reduce) return <ProcessStatic />;

  return (
    <section
      id="process"
      ref={ref}
      className="relative border-y border-rule bg-[#dfdfdb]"
      style={{ height: "520vh" }}
      aria-label="How a screen is designed, layer by layer"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <Floor p={p} />

        <div className="absolute inset-0 flex items-center justify-center pt-10 pb-40 lg:pb-0 lg:pl-[22vw] xl:pl-[18vw]">
          <Device p={p} />
        </div>

        <LayersPanel p={p} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[1200px] px-5 pb-8 sm:px-8 sm:pb-12 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:pb-0">
          <div className="relative h-[150px] max-w-[460px] sm:h-[170px] lg:h-[240px] lg:max-w-[400px]">
            {captions.map((c, i) => (
              <Caption key={c.title} caption={c} first={i === 0} last={i === captions.length - 1} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Caption({
  caption,
  first,
  last,
  p,
}: {
  caption: (typeof captions)[number];
  first: boolean;
  last: boolean;
  p: MotionValue<number>;
}) {
  const [a, b] = caption.range;
  const f = 0.025;
  const opacity = useTransform(p, [a - f, a + f, b - f, b + f], [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(p, [a - f, a + f, b - f, b + f], [first ? 0 : 16, 0, 0, last ? 0 : -16]);
  return (
    <motion.div className="absolute inset-x-0 bottom-0" style={{ opacity, y }}>
      <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] text-graphite sm:text-[40px]">
        {caption.title}
      </h2>
      <p className="mt-3 max-w-[44ch] text-base leading-[1.55] text-graphite-soft sm:text-lg">{caption.body}</p>
    </motion.div>
  );
}

function Floor({ p }: { p: MotionValue<number> }) {
  const explode = useExplode(p);
  const scaleX = useTransform(explode, [0, 1], [1, 1.8]);
  const opacity = useTransform(explode, [0, 1], [0.5, 0.25]);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-[9vh] lg:pb-[6vh]">
      <motion.div
        className="h-10 w-[260px] rounded-[50%] bg-black blur-2xl"
        style={{ scaleX, opacity }}
      />
    </div>
  );
}

function useExplode(p: MotionValue<number>) {
  return useTransform(p, [0.14, 0.32, 0.6, 0.78], [0, 1, 1, 0]);
}

function useActiveLayer(p: MotionValue<number>) {
  return useTransform(p, (v) => {
    if (v < SELECT_START || v >= SELECT_END) return -1;
    const t = (v - SELECT_START) / (SELECT_END - SELECT_START);
    return Math.min(LAYERS.length - 1, Math.floor(t * LAYERS.length));
  });
}

/* ------------------------------------------------------------------ */
/* Layers panel: the flat, readable legend for the exploded stack.     */
/* ------------------------------------------------------------------ */

function LayersPanel({ p }: { p: MotionValue<number> }) {
  const explode = useExplode(p);
  const opacity = useTransform(explode, [0.55, 1], [0, 1]);
  const x = useTransform(explode, [0.55, 1], [16, 0]);
  const active = useActiveLayer(p);
  const ordered = [...LAYERS].map((name, i) => ({ name, i })).reverse(); // top first, like Figma

  return (
    <motion.aside
      aria-hidden
      className="absolute top-1/2 right-[max(2rem,calc((100vw-1200px)/2+2rem))] hidden w-[220px] -translate-y-1/2 rounded-xl border border-rule bg-frame p-2 shadow-[0_1px_2px_rgba(35,38,43,0.06),0_12px_32px_-12px_rgba(35,38,43,0.18)] lg:block"
      style={{ opacity, x }}
    >
      <p className="px-2.5 pt-1.5 pb-2 text-[13px] font-semibold text-graphite">Layers</p>
      <ul>
        {ordered.map(({ name, i }) => (
          <LayerRow key={name} name={name} index={i} active={active} />
        ))}
      </ul>
    </motion.aside>
  );
}

function LayerRow({ name, index, active }: { name: string; index: number; active: MotionValue<number> }) {
  const bg = useTransform(active, (a) => (a === index ? COBALT : "rgba(0,0,0,0)"));
  const color = useTransform(active, (a) => (a === index ? "#fff" : "#23262b"));
  return (
    <motion.li
      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px]"
      style={{ backgroundColor: bg, color }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 4.5h10M4.5 4.5V11" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      {name}
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* The device                                                          */
/* ------------------------------------------------------------------ */

function Device({ p }: { p: MotionValue<number> }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / DEVICE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const k = [0, 0.12, 0.32, 0.46, 0.6, 0.8, 1];
  const rotateX = useTransform(p, k, [16, 0, 56, 56, 56, 0, 0]);
  const rotateY = useTransform(p, k, [-24, 0, 0, 0, 0, 0, 0]);
  const rotateZ = useTransform(p, k, [3, 0, -40, -32, -24, 0, 0]);
  const s = useTransform(p, k, [0.9, 1, 0.74, 0.74, 0.74, 1, 1]);
  const y = useTransform(p, k, [10, 0, 40, 40, 40, 0, 0]);
  const explode = useExplode(p);
  const spread = useTransform(explode, [0, 1], [0, 105]);
  const bodyZ = useTransform(spread, (v) => -v * 2.7);
  const active = useActiveLayer(p);

  return (
    <div
      ref={boxRef}
      className="relative h-[48vh] sm:h-[60vh] lg:h-[min(70vh,720px)]"
      style={{ aspectRatio: `${DEVICE_W} / ${DEVICE_H}`, perspective: 2000 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, rotateZ, scale: s, y, transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            width: DEVICE_W,
            height: DEVICE_H,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Body: sinks to the bottom of the stack when exploded */}
          <motion.div
            className="absolute inset-0 rounded-[58px] bg-[#1c1e22]"
            style={{
              boxShadow:
                "inset 0 0 0 1.5px #3a3d43, inset 0 0 0 4px #121316, 0 1px 0 rgba(255,255,255,0.4)",
              z: bodyZ,
            }}
          >
            <span className="absolute top-[150px] -left-[3px] h-[64px] w-[4px] rounded-l bg-[#2a2c31]" />
            <span className="absolute top-[230px] -left-[3px] h-[64px] w-[4px] rounded-l bg-[#2a2c31]" />
            <span className="absolute top-[190px] -right-[3px] h-[96px] w-[4px] rounded-r bg-[#2a2c31]" />
          </motion.div>

          {LAYERS.map((name, i) => (
            <Layer key={name} index={i} spread={spread} explode={explode} active={active}>
              {name === "Sketch" && <SketchLayer />}
              {name === "Grid" && <GridLayer />}
              {name === "Components" && <ComponentsLayer explode={explode} />}
              {name === "Content" && <ContentLayer />}
              {name === "Visual" && <VisualLayer p={p} />}
            </Layer>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Layer({
  index,
  spread,
  explode,
  active,
  children,
}: {
  index: number;
  spread: MotionValue<number>;
  explode: MotionValue<number>;
  active: MotionValue<number>;
  children: React.ReactNode;
}) {
  const z = useTransform(spread, (s) => index * 0.6 + s * (index - 2));
  const glass = useTransform(explode, (e) => `rgba(255,255,255,${e * 0.42})`);
  const outline = useTransform([explode, active] as MotionValue<number>[], ([e, a]) =>
    a === index
      ? `0 0 0 3px ${COBALT}`
      : `0 0 0 1px rgba(255,255,255,${e * 0.9}), 0 20px 40px -20px rgba(35,38,43,${e * 0.35})`
  );
  // Lower layers only exist as process artifacts; hide them when assembled.
  const opacity = useTransform(explode, [0, 0.35], index < 2 ? [0, 1] : [1, 1]);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[46px]"
      style={{
        left: BEZEL,
        top: BEZEL,
        width: SCREEN_W,
        height: SCREEN_H,
        z,
        opacity,
        backgroundColor: glass,
        boxShadow: outline,
      }}
    >
      {children}
    </motion.div>
  );
}

/* --- Layer 1: pencil wireframe ------------------------------------- */
function SketchLayer() {
  return (
    <svg viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`} className="absolute inset-0 h-full w-full" fill="none">
      <rect width={SCREEN_W} height={SCREEN_H} fill="#fbfaf7" />
      <g stroke="#55585e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
        <path d="M28 98c40-2 90 1 150-1" />
        <path d="M24 150c-2 60 1 120-1 188 100 3 210-2 320 1 2-64-1-128 1-190-104-3-214 2-320 1z" />
        <path d="M262 290a26 26 0 1 0 52 1 26 26 0 1 0-52-1z" />
        <path d="M44 318c50-2 110 1 180-1" />
        <path d="M28 382c30-1 60 1 90-1" />
        {[412, 488, 564].map((y) => (
          <g key={y}>
            <path d={`M24 ${y}c100-2 220 1 318-1 2 20-1 40 1 62-104 2-214-1-320 1-1-20 1-42 1-62z`} />
            <path d={`M38 ${y + 12}h36v36h-36z`} />
            <path d={`M90 ${y + 22}c30-1 70 1 120 0`} />
          </g>
        ))}
        <path d="M20 744c108-2 216 1 326-1" />
        {[62, 140, 222, 300].map((x) => (
          <circle key={x} cx={x} cy={772} r="11" />
        ))}
      </g>
      <g fill="#8a6a2a" fontFamily="ui-serif, Georgia, serif" fontStyle="italic" fontSize="17">
        <text x="190" y="92">one clear next step?</text>
        <text x="150" y="398">what&apos;s due this week</text>
      </g>
    </svg>
  );
}

/* --- Layer 2: columns and spacing ---------------------------------- */
function GridLayer() {
  const cols = 4;
  const margin = 20;
  const gutter = 14;
  const colW = (SCREEN_W - margin * 2 - gutter * (cols - 1)) / cols;
  return (
    <svg viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`} className="absolute inset-0 h-full w-full">
      {Array.from({ length: cols }).map((_, i) => (
        <rect key={i} x={margin + i * (colW + gutter)} y={0} width={colW} height={SCREEN_H} fill={COBALT} opacity="0.1" />
      ))}
      {Array.from({ length: Math.floor(SCREEN_H / 8) }).map((_, i) => (
        <line key={i} x1="0" x2={SCREEN_W} y1={i * 8} y2={i * 8} stroke={COBALT} strokeOpacity="0.07" />
      ))}
      <g stroke="#e5484d" strokeWidth="1.2">
        <line x1="0" x2={margin} y1="250" y2="250" />
        <line x1={margin} x2={margin} y1="242" y2="258" />
      </g>
      <text x="4" y="242" fontSize="11" fill="#e5484d" fontFamily="system-ui">20</text>
    </svg>
  );
}

/* --- Layer 3: neutral component shapes ----------------------------- */
function ComponentsLayer({ explode }: { explode: MotionValue<number> }) {
  const bg = useTransform(explode, [0.55, 0.95], ["rgba(255,255,255,1)", "rgba(255,255,255,0)"]);
  return (
    <motion.div className="absolute inset-0" style={{ backgroundColor: bg }}>
      <div className="absolute rounded-[26px] bg-[#eceef2]" style={{ left: 20, top: 150, width: 326, height: 196 }}>
        <div className="absolute rounded bg-[#d9dce3]" style={{ left: 22, top: 26, width: 60, height: 10 }} />
        <div className="absolute rounded bg-[#d9dce3]" style={{ left: 22, top: 50, width: 180, height: 18 }} />
        <div className="absolute rounded-full bg-[#d9dce3]" style={{ left: 22, top: 168, width: 200, height: 6 }} />
        <div className="absolute rounded-full bg-[#d9dce3]" style={{ left: 252, top: 118, width: 54, height: 54 }} />
      </div>
      {[412, 488, 564].map((y) => (
        <div
          key={y}
          className="absolute rounded-[18px] border border-[#e6e8ec] bg-white"
          style={{ left: 20, top: y, width: 326, height: 64 }}
        >
          <div className="absolute rounded-[12px] bg-[#eceef2]" style={{ left: 12, top: 12, width: 40, height: 40 }} />
        </div>
      ))}
      <div className="absolute border-t border-[#e6e8ec] bg-white" style={{ left: 0, top: 736, width: SCREEN_W, height: 84 }} />
    </motion.div>
  );
}

/* --- Layer 4: words and icons -------------------------------------- */
const rows = [
  { title: "Graphing lines", meta: "6 lessons, due Thursday" },
  { title: "Word problems", meta: "4 lessons, due Sunday" },
  { title: "Quiz: equations", meta: "15 minutes" },
];

function ContentLayer() {
  return (
    <div className="absolute inset-0 text-[#23262b]" style={{ fontFamily: "var(--font-grotesk)" }}>
      <div className="absolute flex w-full justify-between px-[30px]" style={{ top: 18 }}>
        <span className="text-[15px] font-semibold">9:41</span>
        <span className="flex items-center gap-1.5">
          <svg width="18" height="11" viewBox="0 0 18 11"><g fill="#23262b">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5} y={8 - i * 2.6} width="3" height={3 + i * 2.6} rx="0.8" />)}</g></svg>
          <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#23262b" fill="none" opacity="0.5" /><rect x="2" y="2" width="16" height="8" rx="1.8" fill="#23262b" /></svg>
        </span>
      </div>

      <p className="absolute text-[15px] text-[#6b7079]" style={{ left: 22, top: 78 }}>Hi Noa</p>
      <p className="absolute text-[28px] font-semibold tracking-[-0.02em]" style={{ left: 22, top: 98 }}>Keep going</p>

      <p className="absolute text-[18px] font-semibold" style={{ left: 22, top: 372 }}>This week</p>
      <p className="absolute text-[14px] text-[#6b7079]" style={{ right: 22, top: 375 }}>See all</p>

      {rows.map((r, i) => (
        <div key={r.title} className="absolute" style={{ left: 20, top: 412 + i * 76, width: 326, height: 64 }}>
          <p className="absolute text-[16px] font-semibold" style={{ left: 66, top: 12 }}>{r.title}</p>
          <p className="absolute text-[13px] text-[#6b7079]" style={{ left: 66, top: 35 }}>{r.meta}</p>
          <svg className="absolute" style={{ right: 16, top: 25 }} width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="#9aa0a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      ))}

      {["Home", "Courses", "Practice", "Profile"].map((t, i) => (
        <div key={t} className="absolute flex w-[80px] flex-col items-center gap-1 text-[11px] text-[#8b9099]" style={{ left: 23 + i * 80, top: 752 }}>
          <span className="h-[22px] w-[22px] rounded-[7px] border-[1.8px] border-[#8b9099]" />
          {t}
        </div>
      ))}
    </div>
  );
}

/* --- Layer 5: colour, imagery, states, and the live interaction ---- */
function VisualLayer({ p }: { p: MotionValue<number> }) {
  const progress = useTransform(p, [0.86, 0.96], [0.6, 0.72]);
  const width = useTransform(progress, (v) => `${v * 100}%`);
  const pct = useTransform(progress, (v) => `${Math.round(v * 100)}%`);
  const tap = useTransform(p, [0.83, 0.86, 0.9], [0, 0.55, 0]);
  const tapScale = useTransform(p, [0.83, 0.9], [0.6, 1.9]);
  const playing = useTransform(p, (v) => (v > 0.86 ? 1 : 0));
  const paused = useTransform(playing, (v) => 1 - v);

  return (
    <div className="absolute inset-0">
      {/* Dynamic island */}
      <div className="absolute rounded-full bg-black" style={{ left: SCREEN_W / 2 - 62, top: 12, width: 124, height: 36 }} />

      {/* Lesson card */}
      <div className="absolute overflow-hidden rounded-[26px] text-white" style={{ left: 20, top: 150, width: 326, height: 196, background: COBALT }}>
        <svg className="absolute right-0 bottom-0" width="200" height="196" viewBox="0 0 200 196" fill="none" aria-hidden>
          <path d="M10 196 L200 30" stroke="white" strokeOpacity="0.16" strokeWidth="1.5" />
          <path d="M70 196 L200 86" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
          <circle cx="132" cy="90" r="5" fill="white" fillOpacity="0.5" />
        </svg>
        <p className="absolute text-[13px] text-white/75" style={{ left: 22, top: 22 }}>Algebra, unit 4</p>
        <p className="absolute text-[24px] leading-[1.1] font-semibold tracking-[-0.02em]" style={{ left: 22, top: 44, width: 200 }}>
          Linear equations
        </p>
        <p className="absolute text-[13px] text-white/80" style={{ left: 22, top: 140 }}>
          <motion.span>{pct}</motion.span> complete
        </p>
        <div className="absolute overflow-hidden rounded-full bg-white/25" style={{ left: 22, top: 166, width: 200, height: 6 }}>
          <motion.div className="h-full rounded-full bg-white" style={{ width }} />
        </div>
        <div className="absolute flex items-center justify-center rounded-full bg-white" style={{ left: 252, top: 118, width: 54, height: 54 }}>
          <motion.svg className="absolute" width="18" height="20" viewBox="0 0 18 20" style={{ opacity: paused }}><path d="M3 2.5v15l13-7.5z" fill={COBALT} /></motion.svg>
          <motion.svg className="absolute" width="16" height="18" viewBox="0 0 16 18" style={{ opacity: playing }}><rect x="2" y="1" width="4" height="16" rx="1.2" fill={COBALT} /><rect x="10" y="1" width="4" height="16" rx="1.2" fill={COBALT} /></motion.svg>
          <motion.span className="absolute inset-0 rounded-full bg-white" style={{ opacity: tap, scale: tapScale }} />
        </div>
      </div>

      {/* Tinted icon tiles */}
      {[
        { c: "rgba(53,82,242,0.12)", g: "y=x", fg: COBALT },
        { c: "rgba(226,140,40,0.16)", g: "?", fg: "#b8650f" },
        { c: "rgba(47,158,91,0.15)", g: "✓", fg: "#237a46" },
      ].map((t, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center rounded-[12px] text-[13px] font-semibold"
          style={{ left: 32, top: 424 + i * 76, width: 40, height: 40, background: t.c, color: t.fg }}
        >
          {t.g}
        </div>
      ))}

      {/* Active tab */}
      <div className="absolute flex w-[80px] flex-col items-center gap-1 text-[11px] font-medium" style={{ left: 23, top: 752, color: COBALT }}>
        <span className="h-[22px] w-[22px] rounded-[7px]" style={{ background: COBALT }} />
        Home
      </div>

      {/* Home indicator */}
      <div className="absolute rounded-full bg-[#23262b]" style={{ left: SCREEN_W / 2 - 67, top: 800, width: 134, height: 5 }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ProcessStatic() {
  return (
    <section id="process" className="border-y border-rule bg-[#dfdfdb]">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <h2 className="text-[32px] font-semibold tracking-[-0.025em] text-graphite">Every screen is a stack of decisions.</h2>
        <p className="mt-3 max-w-[56ch] text-lg text-graphite-soft">
          Sketch, grid, components, content and visual. I design each layer on purpose, then put it
          back together and ship it.
        </p>
      </div>
    </section>
  );
}
