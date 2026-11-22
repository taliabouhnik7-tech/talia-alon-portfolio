"use client";

import { useEffect, useRef, useState } from "react";
import { edges, nodes, outline, uiRects, type Region } from "@/data/brain";

/*
 * Background: the CV, told as a path through the brain.
 * The timeline on the right is plain, readable content. As each step reaches
 * the middle of the screen, the parts of the brain it trained light up in the
 * drawing on the left. At the last step the neurons leave the brain and
 * rearrange into an interface: how people think, turned into what they use.
 */

const COBALT: [number, number, number] = [53, 82, 242];
const INK: [number, number, number] = [26, 29, 34];

type Step = {
  where: string;
  title: string;
  body: string;
  design: string;
  regions: Region[];
  regionLabel: string;
};

const steps: Step[] = [
  {
    where: "Ben Gurion University",
    title: "B.Sc. in Cognitive & Brain Sciences, minor in math",
    body: "How people perceive, pay attention, remember and decide, and the research methods behind it: ask a clear question, test it, read the data honestly.",
    design: "Fewer choices per screen, a clear visual hierarchy, and decisions backed by evidence rather than taste.",
    regions: ["occipital", "temporal", "frontal"],
    regionLabel: "Perception, memory and decision-making",
  },
  {
    where: "STEM instruction and private tutoring",
    title: "Teaching math one on one",
    body: "Years of sessions with students who were stuck. The question they asked was rarely the real problem.",
    design: "This is how I run interviews and usability tests: listen longer, find the real question, then design.",
    regions: ["temporal", "frontal"],
    regionLabel: "Language and planning",
  },
  {
    where: "HackerU",
    title: "UX/UI design program",
    body: "The full process on solo and team projects: research, personas, user flows, information architecture, wireframes, UI and prototypes.",
    design: "A process I still follow on every project, so nothing gets designed before it's understood.",
    regions: ["parietal", "occipital"],
    regionLabel: "Visual and spatial processing",
  },
  {
    where: "Udemy",
    title: "Advanced Figma",
    body: "Components, variants, auto layout, variables and interactive prototypes.",
    design: "Files a developer can build from, and design systems that hold up past the first screen.",
    regions: ["cerebellum", "parietal"],
    regionLabel: "Skill built through practice",
  },
  {
    where: "Talia Alon Bakery",
    title: "Designed, built and launched my own product",
    body: "An ordering site and admin system for my home bakery. It's live, and real customers order from it.",
    design: "I know what happens after handoff, because I've been on both sides of it.",
    regions: ["frontal", "parietal", "temporal", "occipital", "cerebellum", "stem"],
    regionLabel: "All of it, working together",
  },
  {
    where: "Now",
    title: "Looking for my next team",
    body: "Open to UX/UI roles at product companies and UX consultancies.",
    design: "",
    regions: [],
    regionLabel: "From how people think to what they use",
  },
];

const REGIONS: Region[] = ["frontal", "parietal", "temporal", "occipital", "cerebellum", "stem"];

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const intensity: Record<Region, number> = {
      frontal: 0, parietal: 0, temporal: 0, occipital: 0, cerebellum: 0, stem: 0,
    };
    let morph = 0;
    let lastActive = -2;
    const pulses: { e: number; t: number; v: number }[] = [];
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const mix = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    const tick = () => {
      // Which step is in the reading zone?
      const center = window.innerHeight * 0.5;
      let idx = -1;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < center) idx = i;
      });
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }
      const last = stepRefs.current[steps.length - 1];
      const targetMorph = last
        ? clamp((window.innerHeight * 0.85 - last.getBoundingClientRect().top) / (window.innerHeight * 0.45))
        : 0;
      morph += (targetMorph - morph) * (reduce ? 1 : 0.08);

      const lit = idx >= 0 ? steps[idx].regions : [];
      for (const r of REGIONS) {
        const target = lit.includes(r) ? 1 : 0;
        intensity[r] += (target - intensity[r]) * (reduce ? 1 : 0.07);
      }

      // Spawn signals along lit pathways.
      if (!reduce && lit.length && pulses.length < 26 && Math.random() < 0.35) {
        const e = Math.floor(Math.random() * edges.length);
        const [a, b] = edges[e];
        if (lit.includes(nodes[a].r) || lit.includes(nodes[b].r)) {
          pulses.push({ e, t: 0, v: 0.012 + Math.random() * 0.02 });
        }
      }

      draw();
      frame = requestAnimationFrame(tick);
    };

    const draw = () => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);
      const s = Math.min(w / 610, h / 440);
      const ox = (w - 610 * s) / 2;
      const oy = (h - 440 * s) / 2;
      const X = (x: number) => ox + x * s;
      const Y = (y: number) => oy + y * s;
      const brainAlpha = 1 - ease(clamp(morph * 1.3));

      // Node positions (brain -> interface)
      const n = nodes.length;
      const pos = nodes.map((nd, i) => {
        const local = ease(clamp(morph * 1.5 - (i / n) * 0.5));
        return [X(nd.x + (nd.ux - nd.x) * local), Y(nd.y + (nd.uy - nd.y) * local)] as const;
      });

      // Outline
      if (brainAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = brainAlpha;
        ctx.strokeStyle = rgba(INK, 0.22);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        const pts = outline;
        for (let i = 0; i < pts.length; i++) {
          const p0 = pts[i];
          const p1 = pts[(i + 1) % pts.length];
          const mx = (p0[0] + p1[0]) / 2;
          const my = (p0[1] + p1[1]) / 2;
          if (i === 0) ctx.moveTo(X(mx), Y(my));
          else ctx.quadraticCurveTo(X(p0[0]), Y(p0[1]), X(mx), Y(my));
        }
        const p0 = pts[0];
        const p1 = pts[1];
        ctx.quadraticCurveTo(X(p0[0]), Y(p0[1]), X((p0[0] + p1[0]) / 2), Y((p0[1] + p1[1]) / 2));
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(X(452), Y(330), 72 * s, 40 * s, 0, 0.15 * Math.PI, 1.05 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(X(378), Y(318));
        ctx.lineTo(X(384), Y(410));
        ctx.moveTo(X(410), Y(312));
        ctx.lineTo(X(420), Y(410));
        ctx.stroke();

        // Connections
        for (const [a, b] of edges) {
          const ia = intensity[nodes[a].r];
          const ib = intensity[nodes[b].r];
          const k = Math.min(ia, ib);
          ctx.strokeStyle = rgba(mix(INK, COBALT, k), 0.1 + k * 0.45);
          ctx.lineWidth = 1 + k * 0.6;
          ctx.beginPath();
          ctx.moveTo(pos[a][0], pos[a][1]);
          ctx.lineTo(pos[b][0], pos[b][1]);
          ctx.stroke();
        }

        // Signals
        ctx.fillStyle = rgba(COBALT, 0.9);
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += p.v;
          if (p.t >= 1) {
            pulses.splice(i, 1);
            continue;
          }
          const [a, b] = edges[p.e];
          const x = pos[a][0] + (pos[b][0] - pos[a][0]) * p.t;
          const y = pos[a][1] + (pos[b][1] - pos[a][1]) * p.t;
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Interface wireframe appears as the neurons arrive
      const uiAlpha = ease(clamp(morph * 1.6 - 0.55));
      if (uiAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = uiAlpha;
        uiRects.forEach(([x, y, rw, rh, r], i) => {
          ctx.beginPath();
          ctx.roundRect(X(x), Y(y), rw * s, rh * s, r * s);
          if (i === 2) {
            ctx.fillStyle = rgba(COBALT, 1);
            ctx.fill();
          } else if (i === 6) {
            ctx.fillStyle = rgba(INK, 1);
            ctx.fill();
          } else if (i > 2) {
            ctx.fillStyle = rgba(INK, 0.04);
            ctx.fill();
          }
          ctx.strokeStyle = rgba(INK, i === 0 ? 0.9 : 0.18);
          ctx.lineWidth = i === 0 ? 2 : 1.2;
          ctx.stroke();
        });
        ctx.restore();
      }

      // Neurons
      for (let i = 0; i < n; i++) {
        const k = intensity[nodes[i].r] * brainAlpha;
        const [x, y] = pos[i];
        const r = (2.4 + k * 1.6) * Math.max(0.75, s);
        if (k > 0.05) {
          ctx.fillStyle = rgba(COBALT, 0.12 * k);
          ctx.beginPath();
          ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = rgba(mix(INK, COBALT, Math.max(k, morph * 0.6)), 0.35 + k * 0.6 + morph * 0.3);
        ctx.beginPath();
        ctx.arc(x, y, morph > 0.9 ? r * 0.7 : r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  const label = active >= 0 ? steps[active].regionLabel : "Scroll through my background";

  return (
    <section id="about" className="scroll-mt-16 border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8 sm:pt-28">
        <h2 className="text-[40px] leading-none font-semibold tracking-[-0.03em] text-graphite sm:text-[56px]">
          Background
        </h2>
        <p className="mt-4 max-w-[60ch] text-lg leading-[1.6] text-graphite-soft">
          I came to design through cognitive science and teaching. Here is that path, and what each
          step gives the products I design.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-x-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Sticky brain */}
        <div className="sticky top-16 z-10 -mx-5 border-b border-rule bg-frame/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-24 lg:mx-0 lg:h-[calc(100vh-8rem)] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="flex h-[30vh] flex-col lg:h-full lg:justify-center">
            <canvas ref={canvasRef} aria-hidden className="h-full w-full lg:h-[70%]" />
            <p className="mt-2 text-center text-[15px] text-graphite-soft lg:mt-6" aria-live="polite">
              {label}
            </p>
          </div>
        </div>

        {/* CV timeline */}
        <ol className="pb-20 sm:pb-28">
          {steps.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={`flex flex-col justify-center border-rule py-12 lg:min-h-[64vh] lg:py-16 ${
                i ? "border-t" : ""
              } transition-opacity duration-300 ${active === i || (active === -1 && i === 0) ? "opacity-100" : "lg:opacity-45"}`}
            >
              <p className="text-[15px] text-graphite-soft">
                <span className="mr-3 tabular-nums text-select">{String(i + 1).padStart(2, "0")}</span>
                {step.where}
              </p>
              <h3 className="mt-2 text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] text-graphite sm:text-[30px]">
                {step.title}
              </h3>
              <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.6] text-graphite-soft">{step.body}</p>
              {step.design && (
                <div className="mt-6 max-w-[52ch] rounded-[10px] bg-canvas px-5 py-4">
                  <p className="text-[14px] font-medium text-graphite">In my design work</p>
                  <p className="mt-1 text-[16px] leading-[1.55] text-graphite-soft">{step.design}</p>
                </div>
              )}
              {i === steps.length - 1 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="mailto:taliabouhnik7@gmail.com"
                    className="rounded-full bg-graphite px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-black"
                  >
                    Email me
                  </a>
                  <a
                    href="#work"
                    className="rounded-full border border-graphite/25 px-6 py-3 text-[15px] font-medium text-graphite transition-colors hover:border-graphite"
                  >
                    Back to my work
                  </a>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
