"use client";

import { useEffect, useRef, useState } from "react";
import { edges, nodes, outline, type Region } from "@/data/brain";

/*
 * Background: the CV, told as a path through the brain.
 *
 * The timeline is plain, readable content. As each step reaches the middle of
 * the screen, the brain regions it trained light up with a ripple of signals.
 * On the last step the neurons walk through a real design process on the
 * reader's scroll: they settle into a layout grid, the grid becomes a
 * wireframe, the wireframe becomes an interface, and the interface responds
 * to a tap. How people think, turned into what they use.
 */

const COBALT: RGB = [53, 82, 242];
const INK: RGB = [26, 29, 34];
type RGB = [number, number, number];

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
    body: "Sessions with students who were stuck. The question they asked was rarely the real problem.",
    design: "I bring the same habit to user research: listen longer, find the real question, then design.",
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
    body: "A certificate course in advanced Figma: building reusable components, responsive layouts and interactive prototypes.",
    design: "Organised files a developer can build from, not just screens that look right.",
    regions: ["cerebellum", "parietal"],
    regionLabel: "Skill built through practice",
  },
  {
    where: "Talia Alon Bakery",
    title: "Designed and launched my own product",
    body: "An ordering site and admin system for my home bakery. It's live, and real customers order from it.",
    design: "I know what happens after handoff, because I've been on both sides of it.",
    regions: ["frontal", "parietal", "temporal", "occipital", "cerebellum", "stem"],
    regionLabel: "All of it, working together",
  },
  {
    where: "Ariel University",
    title: "Marketing communications coordinator",
    body: "My current role, since September 2026: coordinating the university's marketing communications.",
    design: "Daily practice in writing for a real audience and working with many people across an organisation.",
    regions: ["temporal", "frontal"],
    regionLabel: "Language and planning",
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
const REGION_NAMES: Partial<Record<Region, string>> = {
  frontal: "Decisions",
  parietal: "Spatial attention",
  temporal: "Language, memory",
  occipital: "Vision",
  cerebellum: "Skill",
};

const STAGES = [
  { name: "Wireframe", text: "The network reshapes into a wireframe" },
  { name: "Interface", text: "The wireframe becomes an interface" },
  { name: "Interaction", text: "And the interface responds" },
];

/* ---------- geometry, computed once ---------------------------------- */

const N = nodes.length;
const centroids = REGIONS.reduce(
  (acc, r) => {
    const pts = nodes.filter((n) => n.r === r);
    acc[r] = [pts.reduce((a, n) => a + n.x, 0) / pts.length, pts.reduce((a, n) => a + n.y, 0) / pts.length];
    return acc;
  },
  {} as Record<Region, [number, number]>
);
const labelPos: Record<Region, [number, number]> = {
  ...centroids,
  frontal: [centroids.frontal[0] - 10, centroids.frontal[1] - 20],
  parietal: [centroids.parietal[0] + 10, centroids.parietal[1] - 25],
  temporal: [centroids.temporal[0], centroids.temporal[1] + 10],
};

// Phone, in the same 610 x 440 drawing space as the brain.
const PX = 210, PY = 20, PW = 190, PH = 400, PR = 30;
type R5 = [number, number, number, number, number];
const UI = {
  header: [PX + 16, PY + 46, 92, 12, 4] as R5,
  card: [PX + 14, PY + 72, PW - 28, 98, 16] as R5,
  rows: [0, 1, 2].map((i) => [PX + 14, PY + 196 + i * 46, PW - 28, 38, 12] as R5),
  button: [PX + 22, PY + PH - 60, PW - 44, 36, 18] as R5,
};
const wireRects: R5[] = [[PX, PY, PW, PH, PR], UI.header, UI.card, ...UI.rows, UI.button];

// Stage 1 targets: a 7-column layout grid, filled row by row.
const COLS = 7;
const byY = nodes.map((_, i) => i).sort((a, b) => nodes[a].y - nodes[b].y);
const gridPos: [number, number][] = new Array(N);
const order: number[] = new Array(N); // 0..1, top-to-bottom, drives the stagger
const rowsCount = Math.ceil(N / COLS);
for (let r = 0; r < rowsCount; r++) {
  const chunk = byY.slice(r * COLS, r * COLS + COLS).sort((a, b) => nodes[a].x - nodes[b].x);
  const offset = (COLS - chunk.length) / 2;
  chunk.forEach((idx, c) => {
    gridPos[idx] = [PX + 18 + ((c + offset) * (PW - 36)) / (COLS - 1), PY + 22 + (r * (PH - 44)) / (rowsCount - 1)];
    order[idx] = (r * COLS + c) / N;
  });
}

// Stage 2 targets: points spaced along every wireframe outline.
function perimeterPoints(count: number) {
  const segs: [number, number, number, number][] = [];
  for (const [x, y, w, h] of wireRects) {
    segs.push([x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]);
  }
  const lens = segs.map(([a, b, c, d]) => Math.hypot(c - a, d - b));
  const total = lens.reduce((a, b) => a + b, 0);
  const out: [number, number][] = [];
  for (let k = 0; k < count; k++) {
    let t = ((k + 0.5) / count) * total;
    for (let i = 0; i < segs.length; i++) {
      if (t <= lens[i]) {
        const f = t / lens[i];
        const [a, b, c, d] = segs[i];
        out.push([a + (c - a) * f, b + (d - b) * f]);
        break;
      }
      t -= lens[i];
    }
  }
  return out;
}
const wirePts = perimeterPoints(N);
// Pseudo-3D: give every neuron a depth inside an ellipsoid so the brain can
// turn as you scroll, and a scattered start point it assembles from.
const BCX = 300, BCY = 215;
const rand = (i: number, k: number) => {
  const v = Math.sin(i * k) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
};
const depthZ = nodes.map((n, i) => {
  const dx = (n.x - BCX) / 270, dy = (n.y - BCY) / 210;
  return rand(i, 78.233) * Math.sqrt(Math.max(0.05, 1 - dx * dx - dy * dy)) * 120;
});
const dust = nodes.map((_, i) => {
  const a = i * 2.39996;
  const r = 230 + (rand(i, 3.17) + 1) * 80;
  return [BCX + Math.cos(a) * r * 1.25, BCY + Math.sin(a) * r * 0.75] as [number, number];
});
const nodeDist = nodes.map((n) => {
  const [cx, cy] = centroids[n.r];
  return Math.hypot(n.x - cx, n.y - cy);
});
const smooth = (x: number) => x * x * (3 - 2 * x);

/* The brain-to-phone morph: every neuron is matched to a point on the app's
   wireframe by angle, so the network keeps its shape while it reshapes, and
   the brain's outline is resampled so it can bend into the phone's frame. */
const PCX = PX + PW / 2, PCY = PY + PH / 2;
const morphTarget: [number, number][] = new Array(N);
const morphOrder: number[] = new Array(N);
{
  const a = nodes.map((_, i) => i).sort((i, j) => Math.atan2(nodes[i].y - BCY, nodes[i].x - BCX) - Math.atan2(nodes[j].y - BCY, nodes[j].x - BCX));
  const b = wirePts.map((_, i) => i).sort((i, j) => Math.atan2(wirePts[i][1] - PCY, wirePts[i][0] - PCX) - Math.atan2(wirePts[j][1] - PCY, wirePts[j][0] - PCX));
  a.forEach((idx, k) => {
    morphTarget[idx] = wirePts[b[k]];
    morphOrder[idx] = Math.hypot(nodes[idx].x - BCX, nodes[idx].y - BCY) / 300;
  });
}
const RING = 180;
function resample(poly: [number, number][], n: number): [number, number][] {
  const segs = poly.map((p, i) => [p, poly[(i + 1) % poly.length]] as const);
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lens.reduce((x, y) => x + y, 0);
  const out: [number, number][] = [];
  for (let k = 0; k < n; k++) {
    let t = (k / n) * total;
    for (let i = 0; i < segs.length; i++) {
      if (t <= lens[i]) {
        const [a, b] = segs[i];
        const f = t / lens[i];
        out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
        break;
      }
      t -= lens[i];
    }
  }
  return out;
}
function roundedRectPoly(x: number, y: number, w: number, h: number, r: number) {
  const pts: [number, number][] = [];
  const arc = (cx: number, cy: number, a0: number) => {
    for (let k = 0; k <= 8; k++) {
      const a = a0 + (k / 8) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  arc(x + w - r, y + r, -Math.PI / 2);
  arc(x + w - r, y + h - r, 0);
  arc(x + r, y + h - r, Math.PI / 2);
  arc(x + r, y + r, Math.PI);
  return pts;
}
const brainRing = resample(outline as [number, number][], RING);
const phoneRing = (() => {
  const ring = resample(roundedRectPoly(PX, PY, PW, PH, PR), RING);
  // start both rings at the same angle so the outline bends instead of twisting
  const a0 = Math.atan2(brainRing[0][1] - BCY, brainRing[0][0] - BCX);
  let best = 0, bestD = 9;
  ring.forEach(([x, y], i) => {
    const d = Math.abs(Math.atan2(y - PCY, x - PCX) - a0);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return [...ring.slice(best), ...ring.slice(0, best)];
})();


/* ---------- helpers -------------------------------------------------- */

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/* ---------- component ------------------------------------------------ */

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(-1);
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(canvas).fontFamily;

    // Everything below is a function of scroll position, lightly smoothed, so
    // scrolling back up plays the whole thing in reverse.
    const intensity = Object.fromEntries(REGIONS.map((r) => [r, 0])) as Record<Region, number>;
    const nodeK = new Float32Array(N);
    const depth = new Float32Array(N);
    const pulses: { e: number; t: number; v: number }[] = [];
    let morph = 0;
    let form = 0;
    let turn = 0;
    let lastIdx = -2;
    let lastStage = -2;
    let frame = 0;
    let running = false;
    let prevT = performance.now();

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

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prevT) / 1000);
      prevT = now;
      const vh = window.innerHeight;

      const k = reduce ? 1 : 1 - Math.exp(-dt * 9);
      const els = stepRefs.current;
      const sec = canvas.closest("section")?.getBoundingClientRect();
      const first = els[0]?.getBoundingClientRect();
      const lastEl = els[steps.length - 1];
      const lastR = lastEl?.getBoundingClientRect();
      if (!sec || !first || !lastR) {
        if (running) frame = requestAnimationFrame(tick);
        return;
      }

      // 1. neurons assemble as the section scrolls in
      form += (clamp((vh * 0.95 - sec.top) / (vh * 0.75)) - form) * k;
      // 2. the brain turns slowly across the whole timeline
      turn += (clamp((vh * 0.5 - first.top) / Math.max(1, lastR.top - first.top)) - turn) * k;
      // 3. how centred each step is, 0..1
      const focus = steps.map((_, i) => {
        const r = els[i]!.getBoundingClientRect();
        const c = i === steps.length - 1 ? r.top + vh * 0.3 : r.top + r.height / 2;
        return smooth(clamp(1 - Math.abs(c - vh * 0.5) / (vh * 0.55)));
      });
      let idx = -1;
      let best = 0.2;
      focus.forEach((f, i) => {
        if (f > best) {
          best = f;
          idx = i;
        }
      });
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
      for (const r of REGIONS) {
        let goal = 0;
        steps.forEach((st, i) => {
          if (st.regions.includes(r)) goal = Math.max(goal, focus[i]);
        });
        intensity[r] += (goal - intensity[r]) * k;
      }
      // light spreads out from the centre of each region as a step scrolls in
      for (let i = 0; i < N; i++) {
        const f = intensity[nodes[i].r];
        const goal = smooth(clamp((f * 300 - nodeDist[i]) / 70));
        nodeK[i] += (goal - nodeK[i]) * k;
      }

      // 4. the final design-process morph
      const target = clamp((vh * 0.7 - lastR.top) / Math.max(1, lastR.height - vh * 0.5));
      morph += (target - morph) * (reduce ? 1 : 1 - Math.exp(-dt * 7));
      const st = morph < 0.02 ? -1 : morph < 0.42 ? 0 : morph < 0.74 ? 1 : 2;
      if (st !== lastStage) {
        lastStage = st;
        setStage(st);
      }

      const anyLit = REGIONS.some((r) => intensity[r] > 0.3);
      if (!reduce && anyLit && pulses.length < 30 && Math.random() < 0.4) {
        const e = Math.floor(Math.random() * edges.length);
        const [a, b] = edges[e];
        if (nodeK[a] > 0.4 || nodeK[b] > 0.4) pulses.push({ e, t: 0, v: 0.8 + Math.random() * 1.2 });
      }

      draw(now, dt);
      if (running) frame = requestAnimationFrame(tick);
    };

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    const draw = (now: number, dt: number) => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);
      const s = Math.min(w / 610, h / 440);
      const ox = (w - 610 * s) / 2;
      const oy = (h - 440 * s) / 2;
      const X = (x: number) => ox + x * s;
      const Y = (y: number) => oy + y * s;
      const txt = (str: string, x: number, y: number, size: number, weight: number, color: string, align: CanvasTextAlign = "left") => {
        ctx.font = `${weight} ${size * s}px ${font}`;
        ctx.textAlign = align;
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.fillText(str, X(x), Y(y));
      };

      // Stage progress
      const s1 = seg(morph, 0, 0.42); // the network reshapes into the wireframe
      const s3 = seg(morph, 0.4, 0.72); // wireframe -> interface
      const s4 = seg(morph, 0.74, 1); // interaction
      const brainA = 1 - ease(seg(s1, 0.2, 0.65));
      const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      /* --- positions --- */
      const t = now / 1000;
      // A fixed side view: the lobes stay where they really are.
      const th = 0 * turn;
      const cosT = Math.cos(th), sinT = Math.sin(th);
      const place = (mv: number, out: [number, number][]) => {
        const S1 = seg(mv, 0, 0.42);
        for (let i = 0; i < N; i++) {
          const n = nodes[i];
          const drift = reduce ? 0 : (1 - S1) * 1.2;
          const rx = n.x - BCX;
          let x = BCX + rx * cosT + depthZ[i] * sinT + Math.sin(t * 0.7 + i * 1.7) * drift;
          let y = n.y + Math.cos(t * 0.6 + i * 2.3) * drift;
          if (out === pos) depth[i] = (depthZ[i] * cosT - rx * sinT) / 140;
          const ff = ease(clamp(form * 1.6 - (1 - order[i]) * 0.6));
          x = dust[i][0] + (x - dust[i][0]) * ff;
          y = dust[i][1] + (y - dust[i][1]) * ff;
          if (S1 > 0) {
            const e = easeIO(clamp(S1 * 1.3 - morphOrder[i] * 0.3));
            x += (morphTarget[i][0] - x) * e;
            y += (morphTarget[i][1] - y) * e;
          }
          out[i] = [X(x), Y(y)];
        }
      };
      const pos: [number, number][] = new Array(N);
      place(morph, pos);

      /* --- the outline bends from brain to phone --- */
      {
        const e = easeIO(clamp(s1 * 1.15));
        const th2 = th;
        ctx.save();
        ctx.globalAlpha = ease(clamp(form * 1.4 - 0.4));
        ctx.strokeStyle = rgba(INK, 0.2 + 0.7 * e);
        ctx.lineWidth = 1.4 + 0.6 * e;
        ctx.beginPath();
        for (let k = 0; k <= RING; k++) {
          const [bx0, by] = brainRing[k % RING];
          const bx = BCX + (bx0 - BCX) * Math.cos(th2);
          const [px, py] = phoneRing[k % RING];
          const x = X(bx + (px - bx) * e), y = Y(by + (py - by) * e);
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        // cerebellum and brain stem fade as the outline straightens
        const rest = 1 - ease(clamp(s1 * 2.5));
        if (rest > 0.01) {
          const OX = (x: number) => X(BCX + (x - BCX) * cosT);
          ctx.globalAlpha *= rest;
          ctx.strokeStyle = rgba(INK, 0.2);
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.ellipse(OX(452), Y(330), 72 * s * Math.abs(cosT), 40 * s, 0, 0.15 * Math.PI, 1.05 * Math.PI);
          ctx.moveTo(OX(378), Y(318));
          ctx.lineTo(OX(384), Y(410));
          ctx.moveTo(OX(410), Y(312));
          ctx.lineTo(OX(420), Y(410));
          ctx.stroke();
        }
        ctx.restore();
      }

      /* --- brain: outline, connections, signals --- */
      if (brainA > 0.01) {
        ctx.save();
        ctx.globalAlpha = brainA * form * form;

        for (const [a, b] of edges) {
          const k = Math.min(nodeK[a], nodeK[b]);
          const dep = 0.75 + 0.25 * Math.max(-1, Math.min(1, (depth[a] + depth[b]) / 2));
          ctx.strokeStyle = rgba(mix(INK, COBALT, k), (0.1 + k * 0.42) * dep);
          ctx.lineWidth = 1 + k * 0.5;
          ctx.beginPath();
          ctx.moveTo(pos[a][0], pos[a][1]);
          ctx.lineTo(pos[b][0], pos[b][1]);
          ctx.stroke();
        }

        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.t += p.v * dt;
          if (p.t >= 1) {
            pulses.splice(i, 1);
            continue;
          }
          const [a, b] = edges[p.e];
          const x = pos[a][0] + (pos[b][0] - pos[a][0]) * p.t;
          const y = pos[a][1] + (pos[b][1] - pos[a][1]) * p.t;
          const fade = Math.sin(p.t * Math.PI);
          ctx.fillStyle = rgba(COBALT, 0.25 * fade);
          ctx.beginPath();
          ctx.arc(x, y, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = rgba(COBALT, 0.95 * fade);
          ctx.beginPath();
          ctx.arc(x, y, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      /* --- stage 2: wireframe --- */
      const wireA = Math.min(ease(seg(s1, 0.55, 1)), 1 - ease(clamp(s3 * 1.4)));
      if (wireA > 0.01) {
        ctx.save();
        ctx.globalAlpha = wireA;
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = rgba(INK, 0.45);
        ctx.fillStyle = rgba(INK, 0.04);
        for (const [x, y, rw, rh, r] of wireRects.slice(1)) {
          roundRect(X(x), Y(y), rw * s, rh * s, r * s);
          ctx.fill();
          ctx.stroke();
        }
        ctx.setLineDash([]);
        // crossed image placeholder in the card, like a real wireframe
        const [cx, cy, cw2, ch] = UI.card;
        ctx.beginPath();
        ctx.moveTo(X(cx), Y(cy));
        ctx.lineTo(X(cx + cw2), Y(cy + ch));
        ctx.moveTo(X(cx + cw2), Y(cy));
        ctx.lineTo(X(cx), Y(cy + ch));
        ctx.strokeStyle = rgba(INK, 0.15);
        ctx.stroke();
        ctx.restore();
      }

      /* --- stage 3: interface --- */
      if (s3 > 0.001) {
        const part = (k: number) => easeOut(clamp(s3 * 1.8 - k * 0.8)); // staggered build
        ctx.save();
        // screen
        ctx.globalAlpha = part(0);
        roundRect(X(PX + 1), Y(PY + 1), (PW - 2) * s, (PH - 2) * s, (PR - 1) * s);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        roundRect(X(PX + PW / 2 - 30), Y(PY + 10), 60 * s, 16 * s, 8 * s);
        ctx.fillStyle = rgba(INK, 1);
        ctx.fill();
        txt("9:41", PX + 26, PY + 18, 9, 600, rgba(INK, 1));
        txt("Hi Noa", PX + 16, PY + 40, 9.5, 400, rgba(INK, 0.55));
        txt("Keep going", PX + 16, PY + 56, 15, 600, rgba(INK, 1));

        // card
        const cA = part(0.15);
        ctx.globalAlpha = cA;
        const [kx, ky, kw, kh, kr] = UI.card;
        const lift = (1 - cA) * 8;
        roundRect(X(kx), Y(ky + lift), kw * s, kh * s, kr * s);
        ctx.fillStyle = rgba(COBALT, 1);
        ctx.fill();
        txt("Algebra, unit 4", kx + 14, ky + lift + 18, 8.5, 400, "rgba(255,255,255,0.75)");
        txt("Linear equations", kx + 14, ky + lift + 36, 14, 600, "#ffffff");
        const prog = 0.6 + 0.08 * ease(seg(s4, 0.55, 0.85));
        txt(`${Math.round(prog * 100)}% complete`, kx + 14, ky + lift + 66, 8.5, 400, "rgba(255,255,255,0.8)");
        roundRect(X(kx + 14), Y(ky + lift + 78), 100 * s, 4 * s, 2 * s);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fill();
        roundRect(X(kx + 14), Y(ky + lift + 78), 100 * prog * s, 4 * s, 2 * s);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(X(kx + kw - 30), Y(ky + lift + kh - 30), 16 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        const px0 = X(kx + kw - 33), py0 = Y(ky + lift + kh - 30);
        ctx.moveTo(px0, py0 - 6 * s);
        ctx.lineTo(px0 + 9 * s, py0);
        ctx.lineTo(px0, py0 + 6 * s);
        ctx.closePath();
        ctx.fillStyle = rgba(COBALT, 1);
        ctx.fill();

        // list
        ctx.globalAlpha = part(0.3);
        txt("This week", PX + 16, PY + 184, 10.5, 600, rgba(INK, 1));
        txt("See all", PX + PW - 16, PY + 184, 9, 400, rgba(INK, 0.5), "right");
        const tiles: [RGB, string, string, string][] = [
          [COBALT, "y=x", "Graphing lines", "6 lessons, due Thursday"],
          [[226, 140, 40], "?", "Word problems", "4 lessons, due Sunday"],
          [[47, 158, 91], "✓", "Quiz: equations", "15 minutes"],
        ];
        UI.rows.forEach(([x, y, rw, rh, r], i) => {
          ctx.globalAlpha = part(0.35 + i * 0.08);
          const dx = (1 - ctx.globalAlpha) * 10;
          roundRect(X(x + dx), Y(y), rw * s, rh * s, r * s);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.strokeStyle = rgba(INK, 0.1);
          ctx.lineWidth = 1;
          ctx.stroke();
          roundRect(X(x + dx + 8), Y(y + 7.5), 23 * s, 23 * s, 7 * s);
          ctx.fillStyle = rgba(tiles[i][0], 0.14);
          ctx.fill();
          txt(tiles[i][1], x + dx + 20, y + 19.5, 8, 600, rgba(tiles[i][0], 1), "center");
          txt(tiles[i][2], x + dx + 40, y + 14, 10, 600, rgba(INK, 1));
          txt(tiles[i][3], x + dx + 40, y + 26, 8, 400, rgba(INK, 0.5));
        });

        // primary action
        const [bx, by, bw, bh, br] = UI.button;
        const press = Math.sin(Math.PI * seg(s4, 0.45, 0.62));
        const sc = 1 - 0.04 * press;
        ctx.globalAlpha = part(0.6);
        const done = s4 > 0.6;
        roundRect(X(bx + (bw * (1 - sc)) / 2), Y(by + (bh * (1 - sc)) / 2), bw * sc * s, bh * sc * s, br * s);
        ctx.fillStyle = rgba(INK, 1);
        ctx.fill();
        txt(done ? "Continue lesson" : "Start lesson", bx + bw / 2, by + bh / 2 + 0.5, 10.5, 600, "#ffffff", "center");
        roundRect(X(PX + PW / 2 - 34), Y(PY + PH - 12), 68 * s, 3.5 * s, 2 * s);
        ctx.fillStyle = rgba(INK, 0.9);
        ctx.fill();
        ctx.restore();

        // labels beside the phone: what each part is for
        if (s4 < 0.3 && w > 420) {
          const la = part(0.7) * (1 - s4 / 0.3);
          ctx.save();
          ctx.globalAlpha = la;
          const notes: [number, string][] = [
            [ky + kh / 2, "Primary task first"],
            [UI.rows[1][1] + 20, "Scannable list, big tap targets"],
            [by + bh / 2, "One clear next step"],
          ];
          for (const [ny, label] of notes) {
            ctx.strokeStyle = rgba(COBALT, 0.6);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(X(PX + PW + 6), Y(ny));
            ctx.lineTo(X(PX + PW + 22), Y(ny));
            ctx.stroke();
            txt(label, PX + PW + 28, ny, 10, 500, rgba(COBALT, 1));
          }
          ctx.restore();
        }
      }

      /* --- neurons (drawn over the build-up, fade as the UI lands) --- */
      const dotA = 1 - ease(clamp(s3 * 1.6));
      if (dotA > 0.01) {
        for (let i = 0; i < N; i++) {
          let k = nodeK[i] * brainA;
          k = Math.min(1.4, k);
          const [x, y] = pos[i];
          const dep = Math.max(-1, Math.min(1, depth[i])) * (1 - s1);
          const r = (2.3 + Math.min(1, k) * 1.5) * Math.max(0.8, s) * (1 - s1 * 0.25) * (1 + dep * 0.22);
          if (k > 0.05) {
            ctx.fillStyle = rgba(COBALT, 0.11 * k * dotA);
            ctx.beginPath();
            ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
            ctx.fill();
          }
          const c = mix(INK, COBALT, Math.max(Math.min(1, k), s1 * 0.85));
          ctx.fillStyle = rgba(c, (0.38 + Math.min(1, k) * 0.55 + s1 * 0.4) * dotA * (0.72 + 0.28 * (dep + 1) / 2) * (0.35 + 0.65 * form));
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* --- region notes --- */
      if (w > 360 && brainA > 0.05) {
        ctx.font = `500 ${Math.round(Math.max(11, 13 * s))}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const r of REGIONS) {
          const name = REGION_NAMES[r];
          const k = intensity[r] * brainA;
          if (!name || k < 0.08) continue;
          const [lx, cy] = labelPos[r];
          const cx = BCX + (lx - BCX) * cosT;
          const ph = Math.max(20, 24 * s);
          const pw = ctx.measureText(name).width + ph * 0.9;
          ctx.globalAlpha = Math.min(1, k * 1.3);
          roundRect(X(cx) - pw / 2, Y(cy) - ph / 2 + (1 - Math.min(1, k)) * 6, pw, ph, ph / 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.strokeStyle = rgba(COBALT, 0.35);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = rgba(COBALT, 1);
          ctx.fillText(name, X(cx), Y(cy) + 0.5 + (1 - Math.min(1, k)) * 6);
          ctx.globalAlpha = 1;
        }
      }

      /* --- stage 4: a tap, then confirmation --- */
      if (s4 > 0.001) {
        const [bx, by, bw, bh] = UI.button;
        const tx = bx + bw * 0.62, ty = by + bh * 0.6;
        const travel = ease(seg(s4, 0, 0.45));
        const sx = PX + PW + 70, sy = PY + PH + 30;
        const cx = sx + (tx - sx) * travel + Math.sin(travel * Math.PI) * -18;
        const cy = sy + (ty - sy) * travel;
        const curA = Math.min(seg(s4, 0, 0.12), 1 - seg(s4, 0.85, 1));
        // ripple
        const rp = seg(s4, 0.48, 0.78);
        if (rp > 0 && rp < 1) {
          ctx.fillStyle = rgba([255, 255, 255], 0.45 * (1 - rp));
          ctx.beginPath();
          ctx.arc(X(tx), Y(ty), (6 + rp * 40) * s, 0, Math.PI * 2);
          ctx.save();
          roundRect(X(bx), Y(by), bw * s, bh * s, 19 * s);
          ctx.clip();
          ctx.beginPath();
          ctx.arc(X(tx), Y(ty), (6 + rp * 40) * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // cursor
        if (curA > 0.01) {
          ctx.save();
          ctx.globalAlpha = curA;
          ctx.translate(X(cx), Y(cy));
          const k = s * 1.1 * (1 - 0.12 * Math.sin(Math.PI * seg(s4, 0.45, 0.62)));
          ctx.scale(k, k);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, 17);
          ctx.lineTo(4.5, 13);
          ctx.lineTo(8, 20);
          ctx.lineTo(10.5, 19);
          ctx.lineTo(7, 12);
          ctx.lineTo(12.5, 12);
          ctx.closePath();
          ctx.fillStyle = rgba(INK, 1);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.restore();
        }
        // toast
        const ta = easeOut(seg(s4, 0.62, 0.8));
        if (ta > 0) {
          ctx.save();
          ctx.globalAlpha = ta;
          const ty0 = PY + 12 - (1 - ta) * 14;
          ctx.shadowColor = "rgba(26,29,34,0.18)";
          ctx.shadowBlur = 14 * s;
          ctx.shadowOffsetY = 4 * s;
          roundRect(X(PX + 14), Y(ty0), (PW - 28) * s, 30 * s, 10 * s);
          ctx.fillStyle = rgba(INK, 1);
          ctx.fill();
          ctx.shadowColor = "transparent";
          ctx.beginPath();
          ctx.arc(X(PX + 30), Y(ty0 + 15), 6 * s, 0, Math.PI * 2);
          ctx.fillStyle = "#2f9e5b";
          ctx.fill();
          txt("✓", PX + 30, ty0 + 15.5, 7, 700, "#ffffff", "center");
          txt("Lesson started", PX + 42, ty0 + 15, 9.5, 500, "#ffffff");
          ctx.restore();
        }
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        prevT = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    const section = canvas.closest("section");
    if (section) io.observe(section);
    tick(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const caption = stage >= 0 ? STAGES[stage].text : active >= 0 ? steps[active].regionLabel : "Scroll through my background";

  return (
    <section id="about" className="scroll-mt-16 border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8 sm:pt-28">
        <h2 className="text-[40px] leading-none font-semibold tracking-[-0.03em] text-graphite sm:text-[56px]">Background</h2>
        <p className="mt-4 max-w-[60ch] text-lg leading-[1.6] text-graphite-soft">
          I came to design through cognitive science and teaching. Here is that path, and what each step gives the
          products I design.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-x-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="sticky top-16 z-10 -mx-5 border-b border-rule bg-white/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-24 lg:mx-0 lg:h-[calc(100vh-8rem)] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="flex h-[32vh] flex-col lg:h-full lg:justify-center">
            <canvas ref={canvasRef} aria-hidden className="h-full w-full font-sans lg:h-[80%]" />
            <div className="mt-2 flex flex-col items-center gap-2.5 lg:mt-6">
              <p className="text-center text-[15px] text-graphite-soft" aria-live="polite">
                {caption}
              </p>
              <p className="hidden text-center text-[12px] text-graphite-soft/70 lg:block">
                A simplified map: each lobe leads certain functions, but real thinking uses many regions together.
              </p>
              <ol className={`flex gap-1.5 transition-opacity duration-500 ${stage >= 0 ? "opacity-100" : "opacity-0"}`} aria-hidden>
                {STAGES.map((st, i) => (
                  <li
                    key={st.name}
                    className={`rounded-full px-2.5 py-0.5 text-[12px] transition-colors duration-300 ${
                      i === stage ? "bg-select text-white" : i < stage ? "bg-select/10 text-select" : "bg-canvas text-graphite-soft"
                    }`}
                  >
                    {st.name}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <ol data-timeline className="pb-20 sm:pb-28">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={`border-rule ${i ? "border-t" : ""} ${
                  isLast ? "min-h-[150vh] py-12 lg:min-h-[170vh] lg:py-16" : "flex flex-col justify-center py-12 lg:min-h-[64vh] lg:py-16"
                } transition-opacity duration-500 ${active === i || (active === -1 && i === 0) ? "opacity-100" : "lg:opacity-40"}`}
              >
                <div className={isLast ? "lg:sticky lg:top-[38vh]" : ""}>
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
                  {isLast && (
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
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
