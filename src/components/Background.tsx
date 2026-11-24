"use client";

import { useEffect, useRef, useState } from "react";
import { HUBS, POINTS_B64, POINT_COUNT, REGION_CODES } from "@/data/brain3d";

/*
 * Background: the CV, told as a path through the brain.
 *
 * The brain is a real one: points sampled from the fsaverage cortical surface,
 * an average of real MRI scans, with lobes split along the standard
 * landmarks. As the reader scrolls through each step of the timeline, the
 * brain turns to the regions that step trained, lights them, and draws a
 * signal path between them. On the last step the same points flow into a
 * phone and become an interface: how people think, turned into what they use.
 */

type Region = (typeof REGION_CODES)[number];
type RGB = [number, number, number];

const GLOW: RGB = [93, 142, 255];
const HOT: RGB = [168, 210, 255];
const DIM: RGB = [86, 112, 168];
const TEXT: RGB = [232, 236, 244];
const SCREEN = "#0d1220";

type Step = {
  where: string;
  when?: string;
  title: string;
  body: string;
  design: string;
  regions: Region[]; // in the order the signal travels
  regionLabel: string;
};

const steps: Step[] = [
  {
    where: "Ben Gurion University",
    when: "2021–2024",
    title: "B.Sc. in Cognitive & Brain Sciences, minor in math",
    body: "How people perceive, pay attention, remember and decide, and the research methods behind it: ask a clear question, test it, read the data honestly.",
    design: "Fewer choices per screen, a clear visual hierarchy, and decisions backed by evidence rather than taste.",
    regions: ["occipital", "temporal", "frontal"],
    regionLabel: "Perception, memory and decision-making",
  },
  {
    where: "STEM instruction and private tutoring",
    when: "2020–2025",
    title: "Teaching math and science",
    body: "Math tutoring for children and teens, on my own and through the PERACH project, then teaching STEM at Technoda.",
    design: "I bring the same habit to user research: listen longer, find the real question, then design.",
    regions: ["temporal", "frontal"],
    regionLabel: "Language and planning",
  },
  {
    where: "HackerU",
    when: "2025–2026",
    title: "UX/UI design program",
    body: "The full process on solo and team projects: research, personas, user flows, information architecture, wireframes, UI and prototypes.",
    design: "A process I still follow on every project, so nothing gets designed before it's understood.",
    regions: ["occipital", "parietal"],
    regionLabel: "Visual and spatial processing",
  },
  {
    where: "Udemy",
    when: "2026",
    title: "Advanced Figma",
    body: "A certificate course in advanced Figma: building reusable components, responsive layouts and interactive prototypes.",
    design: "Organised files a developer can build from, not just screens that look right.",
    regions: ["parietal", "cerebellum"],
    regionLabel: "Skill built through practice",
  },
  {
    where: "Talia Alon Bakery",
    title: "Designed and launched my own product",
    body: "An ordering site and admin system for my home bakery. It's live, and real customers order from it.",
    design: "Taking a design all the way to a live product showed me what holds up once real customers use it.",
    regions: ["frontal", "parietal", "occipital", "cerebellum", "temporal"],
    regionLabel: "All of it, working together",
  },
  {
    where: "Ariel University",
    when: "Since September 2026",
    title: "Marketing communications coordinator",
    body: "My current role: coordinating the university's marketing communications.",
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

const REGION_NAMES: Partial<Record<Region, string>> = {
  frontal: "Decisions, planning",
  parietal: "Spatial attention",
  temporal: "Language, memory",
  occipital: "Vision",
  cerebellum: "Coordination, skill",
};

// Where the camera sits to see each region best: yaw, pitch (radians).
const VIEWS: Record<Region | "home", [number, number]> = {
  home: [0.35, 0.12],
  frontal: [0.8, 0.16],
  temporal: [0.02, -0.1],
  parietal: [-0.3, 0.6],
  occipital: [-1.0, 0.1],
  cerebellum: [-0.75, -0.38],
  stem: [0, 0],
};

const STAGES = [
  { name: "Wireframe", text: "The same points reshape into a wireframe" },
  { name: "Interface", text: "The wireframe becomes an interface" },
  { name: "Interaction", text: "And the interface responds" },
];

/* ---------- geometry, computed once on the client ---------------------- */

const N = POINT_COUNT;
const CX = 0, CY = -17, CZ = 12; // brain centre, mm
const K = 2.45; // drawing units per mm
const BCX = 305, BCY = 222;

type Geo = {
  x: Float32Array; y: Float32Array; z: Float32Array;
  reg: Uint8Array; bri: Float32Array;
  nx: Float32Array; ny: Float32Array; nz: Float32Array;
  dx: Float32Array; dy: Float32Array; dz: Float32Array;
  hubDist: Float32Array; target: Float32Array; order: Float32Array;
};

// Phone, in the same 610 x 440 drawing space.
const PX = 210, PY = 20, PW = 190, PH = 400, PR = 30;
type R5 = [number, number, number, number, number];
const UI = {
  header: [PX + 16, PY + 46, 92, 12, 4] as R5,
  card: [PX + 14, PY + 72, PW - 28, 98, 16] as R5,
  rows: [0, 1, 2].map((i) => [PX + 14, PY + 196 + i * 46, PW - 28, 38, 12] as R5),
  button: [PX + 22, PY + PH - 60, PW - 44, 36, 18] as R5,
};
const wireRects: R5[] = [[PX, PY, PW, PH, PR], UI.header, UI.card, ...UI.rows, UI.button];

function perimeterPoints(count: number) {
  const segs: [number, number, number, number][] = [];
  for (const [x, y, w, h] of wireRects) segs.push([x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]);
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

const rand = (i: number, k: number) => {
  const v = Math.sin(i * k) * 43758.5453;
  return v - Math.floor(v);
};

function buildGeo(): Geo {
  const bin = atob(POINTS_B64);
  const g: Geo = {
    x: new Float32Array(N), y: new Float32Array(N), z: new Float32Array(N),
    reg: new Uint8Array(N), bri: new Float32Array(N),
    nx: new Float32Array(N), ny: new Float32Array(N), nz: new Float32Array(N),
    dx: new Float32Array(N), dy: new Float32Array(N), dz: new Float32Array(N),
    hubDist: new Float32Array(N), target: new Float32Array(N * 2), order: new Float32Array(N),
  };
  for (let i = 0; i < N; i++) {
    const o = i * 8;
    g.x[i] = bin.charCodeAt(o) - 128 - CX;
    g.y[i] = bin.charCodeAt(o + 1) - 128 - CY;
    g.z[i] = bin.charCodeAt(o + 2) - 128 - CZ;
    g.reg[i] = bin.charCodeAt(o + 3);
    g.bri[i] = bin.charCodeAt(o + 4) / 255;
    g.nx[i] = (bin.charCodeAt(o + 5) - 128) / 127;
    g.ny[i] = (bin.charCodeAt(o + 6) - 128) / 127;
    g.nz[i] = (bin.charCodeAt(o + 7) - 128) / 127;
    // scattered start point the brain assembles from
    const u = rand(i, 12.9898) * 2 - 1, th = rand(i, 78.233) * Math.PI * 2, r = 150 + rand(i, 37.719) * 110;
    const s = Math.sqrt(1 - u * u);
    g.dx[i] = s * Math.cos(th) * r; g.dy[i] = s * Math.sin(th) * r; g.dz[i] = u * r * 0.7;
  }
  for (let i = 0; i < N; i++) {
    const h = HUBS[REGION_CODES[g.reg[i]] as keyof typeof HUBS];
    g.hubDist[i] = h === undefined ? 999 : Math.hypot(g.x[i] - g.x[h], g.y[i] - g.y[h], g.z[i] - g.z[h]);
  }
  // Brain-to-phone: match points to the wireframe by angle in the home view,
  // so the shape flows into the phone instead of scrambling.
  const wire = perimeterPoints(N);
  const [a0, p0] = VIEWS.home;
  const ang = (i: number) => {
    const xr = g.x[i] * Math.cos(a0) - g.y[i] * Math.sin(a0);
    const yr = g.x[i] * Math.sin(a0) + g.y[i] * Math.cos(a0);
    const sy = g.z[i] * Math.cos(p0) + xr * Math.sin(p0);
    return Math.atan2(-sy, -yr);
  };
  const a = Array.from({ length: N }, (_, i) => i).sort((i, j) => ang(i) - ang(j));
  const pc = [PX + PW / 2, PY + PH / 2];
  const b = wire.map((_, i) => i).sort((i, j) => Math.atan2(wire[i][1] - pc[1], wire[i][0] - pc[0]) - Math.atan2(wire[j][1] - pc[1], wire[j][0] - pc[0]));
  a.forEach((idx, k) => {
    g.target[idx * 2] = wire[b[k]][0];
    g.target[idx * 2 + 1] = wire[b[k]][1];
    g.order[idx] = rand(idx, 4.1414);
  });
  return g;
}

function sprite(c: RGB) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const x = cv.getContext("2d")!;
  const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},1)`);
  gr.addColorStop(0.25, `rgba(${c[0]},${c[1]},${c[2]},0.35)`);
  gr.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
  x.fillStyle = gr;
  x.fillRect(0, 0, 64, 64);
  return cv;
}

/* ---------- helpers -------------------------------------------------- */

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (x: number) => x * x * (3 - 2 * x);
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

type Waypoint = { step: number; region: Region | null };

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
    const g = buildGeo();
    const glowSprite = sprite(GLOW);
    const hotSprite = sprite(HOT);

    // The path through the brain: a waypoint per region per step.
    const wps: Waypoint[] = [{ step: -1, region: null }];
    steps.forEach((st, i) => st.regions.forEach((r) => wps.push({ step: i, region: r })));
    wps.push({ step: steps.length - 1, region: null });

    const nodeK = new Float32Array(N);
    const sx = new Float32Array(N), sy = new Float32Array(N), sd = new Float32Array(N);
    const regionLit: Record<string, number> = {};
    REGION_CODES.forEach((r) => (regionLit[r] = 0));
    let yaw = VIEWS.home[0], pitch = VIEWS.home[1];
    let u = 0; // smoothed position along the path, in waypoints
    let morph = 0, form = 0;
    let lastActive = -2, lastStage = -2;
    let frame = 0, running = false;
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

    // where each waypoint sits relative to the reading line (px, <0 = passed)
    const wpOffsets = (vh: number) => {
      const els = stepRefs.current;
      const out: number[] = [];
      const firstR = els[0]!.getBoundingClientRect();
      out.push(firstR.top - vh * 0.25 - vh * 0.5);
      steps.forEach((st, i) => {
        const r = els[i]!.getBoundingClientRect();
        const m = st.regions.length;
        st.regions.forEach((_, j) => {
          const f = m === 1 ? 0.5 : 0.18 + (0.62 * j) / (m - 1);
          out.push(r.top + r.height * f - vh * 0.5);
        });
      });
      const lastR = els[steps.length - 1]!.getBoundingClientRect();
      out.push(lastR.top + vh * 0.05 - vh * 0.5);
      return out;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prevT) / 1000);
      prevT = now;
      const vh = window.innerHeight;
      const k = reduce ? 1 : 1 - Math.exp(-dt * 6);
      const els = stepRefs.current;
      const sec = canvas.closest("section")?.getBoundingClientRect();
      const lastR = els[steps.length - 1]?.getBoundingClientRect();
      if (!sec || !lastR || !els[0]) {
        if (running) frame = requestAnimationFrame(tick);
        return;
      }

      form += (clamp((vh * 0.95 - sec.top) / (vh * 0.8)) - form) * k;

      // position along the path: hold at each region, travel between them
      const off = wpOffsets(vh);
      let goal = 0;
      for (let i = 0; i < off.length; i++) {
        if (off[i] <= 0) {
          const next = off[i + 1];
          goal = next === undefined ? i : i + smooth(seg(-off[i] / (next - off[i]), 0.2, 0.8));
        }
      }
      u += (goal - u) * k;
      const ki = Math.min(wps.length - 1, Math.floor(u));
      const f = ease(clamp(u - ki));
      const A = wps[ki], B = wps[Math.min(wps.length - 1, ki + 1)];
      const va = VIEWS[A.region ?? "home"], vb = VIEWS[B.region ?? "home"];
      const sway = reduce ? 0 : Math.sin(now / 4000) * 0.12;
      yaw += (va[0] + (vb[0] - va[0]) * f + sway - yaw) * k;
      pitch += (va[1] + (vb[1] - va[1]) * f - pitch) * k;

      const near = wps[Math.round(u)];
      const act = near.step;
      if (act !== lastActive) {
        lastActive = act;
        setActive(act);
      }
      // regions of the current step light up as the path reaches them
      const goalLit: Record<string, number> = {};
      REGION_CODES.forEach((r) => (goalLit[r] = 0));
      wps.forEach((w, i) => {
        if (w.region && w.step === act) goalLit[w.region] = Math.max(goalLit[w.region], smooth(clamp((u - i) * 2 + 1)));
      });
      for (const r of REGION_CODES) regionLit[r] += (goalLit[r] - regionLit[r]) * k;
      for (let i = 0; i < N; i++) {
        const lit = regionLit[REGION_CODES[g.reg[i]]];
        const t = smooth(clamp((lit * 120 - g.hubDist[i]) / 30));
        nodeK[i] += (t - nodeK[i]) * k;
      }

      const target = clamp((vh * 0.7 - lastR.top) / Math.max(1, lastR.height - vh * 0.5));
      morph += (target - morph) * (reduce ? 1 : 1 - Math.exp(-dt * 7));
      const st = morph < 0.02 ? -1 : morph < 0.42 ? 0 : morph < 0.74 ? 1 : 2;
      if (st !== lastStage) {
        lastStage = st;
        setStage(st);
      }

      try {
        draw(now, u);
      } catch (err) {
        console.error(err);
      }
      if (running) frame = requestAnimationFrame(tick);
    };

    // Older Safari and Firefox lack ctx.roundRect; draw the corners by hand there.
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, w, h, r);
        return;
      }
      const rr = Math.max(0, Math.min(r, w / 2, h / 2));
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };

    const me = new Float32Array(N);
    const vis = new Float32Array(N);
    const buckets: number[][] = Array.from({ length: 30 }, () => []);
    const COLS: RGB[] = [DIM, GLOW, HOT];

    const draw = (now: number, u: number) => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);
      const s = Math.min(w / 610, h / 440);
      const ox = (w - 610 * s) / 2;
      const oy = (h - 440 * s) / 2;
      const X = (x: number) => ox + x * s;
      const Y = (y: number) => oy + y * s;
      const px1 = Math.max(0.8, s); // a "pixel" that stays visible on small screens
      const txt = (str: string, x: number, y: number, size: number, weight: number, color: string, align: CanvasTextAlign = "left") => {
        ctx.font = `${weight} ${size * s}px ${font}`;
        ctx.textAlign = align;
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.fillText(str, X(x), Y(y));
      };
      const t = now / 1000;

      const s1 = seg(morph, 0, 0.42); // points flow into the wireframe
      const s3 = seg(morph, 0.4, 0.72); // wireframe -> interface
      const s4 = seg(morph, 0.74, 1); // interaction
      const brainA = 1 - ease(clamp(s1 * 2));

      // camera: the brain spins a little faster as it dissolves into the phone
      const a = yaw + ease(s1) * 1.4;
      const p = pitch * (1 - ease(s1));
      const ca = Math.cos(a), sa = Math.sin(a), cp = Math.cos(p), sp = Math.sin(p);
      const F = 520;
      const project = (x: number, y: number, z: number): [number, number, number] => {
        const xr = x * ca - y * sa;
        const yr = x * sa + y * ca;
        const d = xr * cp - z * sp;
        const up = z * cp + xr * sp;
        const pf = F / (F + d);
        return [BCX - yr * K * pf, BCY - up * K * pf, d];
      };
      const depthFade = (d: number) => 0.16 + 0.84 * clamp((75 - d) / 150);

      /* --- points --- */
      for (const b of buckets) b.length = 0;
      for (let i = 0; i < N; i++) {
        const fi = ease(clamp(form * 1.5 - g.order[i] * 0.5));
        const x = g.dx[i] + (g.x[i] - g.dx[i]) * fi;
        const y = g.dy[i] + (g.y[i] - g.dy[i]) * fi;
        const z = g.dz[i] + (g.z[i] - g.dz[i]) * fi;
        let [qx, qy, d] = project(x, y, z);
        let e = 0;
        if (s1 > 0) {
          e = ease(clamp(s1 * 1.35 - g.order[i] * 0.35));
          qx += (g.target[i * 2] - qx) * e;
          qy += (g.target[i * 2 + 1] - qy) * e;
        }
        me[i] = e;
        sx[i] = X(qx);
        sy[i] = Y(qy);
        sd[i] = d;
        // light the real surface: folds from sulcal depth, shape from normals
        const nxr = g.nx[i] * ca - g.ny[i] * sa;
        const facing = -(nxr * cp - g.nz[i] * sp);
        const lightness = facing > 0 ? 0.12 + 0.88 * Math.pow(facing, 0.8) : 0.06 * (1 + facing);
        const rim = facing > -0.2 ? Math.pow(1 - Math.abs(facing), 3) : 0;
        const fa = facing > 0 ? 1 : 0.22;
        vis[i] = fa;
        const kk = nodeK[i] * brainA;
        const gyr = 0.3 + 0.7 * g.bri[i];
        const base = (gyr * lightness * 0.8 + rim * 0.32) * (0.25 + 0.75 * form);
        const alpha = (base + (Math.min(1, 0.4 + kk) * fa * gyr - base) * Math.max(kk, 0) + (0.85 - base) * e) * (1 - ease(clamp(s3 * 1.6)));
        if (alpha < 0.02) continue;
        const col = kk > 0.6 ? 2 : kk > 0.15 || e > 0.5 ? 1 : 0;
        buckets[col * 10 + Math.min(9, Math.floor(alpha * 10))].push(i);
      }
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let bi = 0; bi < 30; bi++) {
        const list = buckets[bi];
        if (!list.length) continue;
        const col = COLS[Math.floor(bi / 10)];
        ctx.fillStyle = rgba(col, ((bi % 10) + 0.5) / 10);
        ctx.beginPath();
        for (const i of list) {
          const r = px1 * (1.05 + nodeK[i] * brainA * 0.8 + me[i] * 0.45);
          ctx.rect(sx[i] - r / 2, sy[i] - r / 2, r, r);
        }
        ctx.fill();
      }
      // a soft glow around lit neurons
      if (brainA > 0.01) {
        const R = 6 * px1;
        for (let i = 0; i < N; i += 3) {
          const kk = nodeK[i] * brainA;
          if (kk < 0.25) continue;
          ctx.globalAlpha = 0.3 * kk * vis[i] * (0.4 + 0.6 * g.bri[i]);
          ctx.drawImage(glowSprite, sx[i] - R, sy[i] - R, R * 2, R * 2);
        }
        ctx.globalAlpha = 1;
      }

      /* --- signal paths between the regions of the current step --- */
      if (brainA > 0.01 && lastActive >= 0) {
        for (let i = 0; i < wps.length - 1; i++) {
          const wa = wps[i], wb = wps[i + 1];
          if (!wa.region || !wb.region || wa.step !== lastActive || wb.step !== lastActive) continue;
          const pr = clamp(u - i);
          if (pr <= 0) continue;
          const ha = HUBS[wa.region as keyof typeof HUBS], hb = HUBS[wb.region as keyof typeof HUBS];
          const A = [g.x[ha], g.y[ha], g.z[ha]], B = [g.x[hb], g.y[hb], g.z[hb]];
          const ra = Math.hypot(A[0], A[1], A[2]), rb = Math.hypot(B[0], B[1], B[2]);
          const lift = 0.22 * Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
          const M = 44;
          const pts: [number, number, number][] = [];
          for (let j = 0; j <= M; j++) {
            const tt = j / M;
            const m0 = A[0] + (B[0] - A[0]) * tt, m1 = A[1] + (B[1] - A[1]) * tt, m2 = A[2] + (B[2] - A[2]) * tt;
            const len = Math.hypot(m0, m1, m2) || 1;
            const R = ra + (rb - ra) * tt + lift * Math.sin(Math.PI * tt);
            const [qx, qy, d] = project((m0 / len) * R, (m1 / len) * R, (m2 / len) * R);
            pts.push([X(qx), Y(qy), d]);
          }
          const end = pr * M;
          for (let j = 0; j < Math.ceil(end); j++) {
            const fr = Math.min(1, end - j);
            const [x0, y0, d0] = pts[j];
            const [x1, y1] = pts[j + 1];
            const xe = x0 + (x1 - x0) * fr, ye = y0 + (y1 - y0) * fr;
            const fa = depthFade(d0) * brainA;
            ctx.strokeStyle = rgba(GLOW, 0.18 * fa);
            ctx.lineWidth = 5 * px1;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(xe, ye);
            ctx.stroke();
            ctx.strokeStyle = rgba(HOT, 0.85 * fa);
            ctx.lineWidth = 1.4 * px1;
            ctx.stroke();
          }
          // the signal: a bright head while drawing, then pulses that keep travelling
          const head = pr < 1 ? pr : reduce ? -1 : (t * 0.45 + i * 0.37) % 1;
          if (head >= 0) {
            const j = Math.min(M - 1, Math.floor(head * M));
            const fr = head * M - j;
            const hx = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * fr;
            const hy = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * fr;
            const R = 11 * px1;
            ctx.globalAlpha = depthFade(pts[j][2]) * brainA;
            ctx.drawImage(hotSprite, hx - R, hy - R, R * 2, R * 2);
            ctx.globalAlpha = 1;
          }
        }
      }

      /* --- region hubs: a glowing point with a ping --- */
      const hubScreen: Partial<Record<Region, [number, number, number]>> = {};
      if (brainA > 0.01) {
        for (const r of Object.keys(HUBS) as Region[]) {
          const lit = regionLit[r] * brainA;
          if (lit < 0.03) continue;
          const hi = HUBS[r as keyof typeof HUBS];
          const fa = 0.25 + 0.75 * vis[hi];
          const hx = sx[hi], hy = sy[hi];
          hubScreen[r] = [hx, hy, fa * lit];
          const R = 18 * px1;
          ctx.globalAlpha = lit * fa;
          ctx.drawImage(hotSprite, hx - R, hy - R, R * 2, R * 2);
          ctx.globalAlpha = 1;
          ctx.fillStyle = rgba([255, 255, 255], 0.95 * lit * fa);
          ctx.beginPath();
          ctx.arc(hx, hy, 2.4 * px1, 0, Math.PI * 2);
          ctx.fill();
          if (!reduce) {
            const ph = (t * 0.6) % 1;
            ctx.strokeStyle = rgba(HOT, (1 - ph) * 0.8 * lit * fa);
            ctx.lineWidth = 1.2 * px1;
            ctx.beginPath();
            ctx.arc(hx, hy, (4 + ph * 22) * px1, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      /* --- wireframe --- */
      const wireA = Math.min(ease(seg(s1, 0.55, 1)), 1 - ease(clamp(s3 * 1.4)));
      if (wireA > 0.01) {
        ctx.save();
        ctx.globalAlpha = wireA;
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = rgba(GLOW, 0.9);
        roundRect(X(PX), Y(PY), PW * s, PH * s, PR * s);
        ctx.stroke();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = rgba(GLOW, 0.6);
        ctx.fillStyle = rgba(GLOW, 0.05);
        for (const [x, y, rw, rh, r] of wireRects.slice(1)) {
          roundRect(X(x), Y(y), rw * s, rh * s, r * s);
          ctx.fill();
          ctx.stroke();
        }
        ctx.setLineDash([]);
        const [cx, cy, cw2, ch] = UI.card;
        ctx.beginPath();
        ctx.moveTo(X(cx), Y(cy));
        ctx.lineTo(X(cx + cw2), Y(cy + ch));
        ctx.moveTo(X(cx + cw2), Y(cy));
        ctx.lineTo(X(cx), Y(cy + ch));
        ctx.strokeStyle = rgba(GLOW, 0.25);
        ctx.stroke();
        ctx.restore();
      }

      /* --- interface --- */
      if (s3 > 0.001) {
        const part = (k: number) => easeOut(clamp(s3 * 1.8 - k * 0.8));
        ctx.save();
        ctx.globalAlpha = part(0);
        ctx.shadowColor = rgba(GLOW, 0.35);
        ctx.shadowBlur = 40 * s;
        roundRect(X(PX), Y(PY), PW * s, PH * s, PR * s);
        ctx.fillStyle = SCREEN;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.lineWidth = 1;
        ctx.stroke();
        roundRect(X(PX + PW / 2 - 30), Y(PY + 10), 60 * s, 16 * s, 8 * s);
        ctx.fillStyle = "#000";
        ctx.fill();
        txt("9:41", PX + 26, PY + 18, 9, 600, rgba(TEXT, 1));
        txt("Hi Noa", PX + 16, PY + 40, 9.5, 400, rgba(TEXT, 0.55));
        txt("Keep going", PX + 16, PY + 56, 15, 600, rgba(TEXT, 1));

        const cA = part(0.15);
        ctx.globalAlpha = cA;
        const [kx, ky, kw, kh, kr] = UI.card;
        const lift = (1 - cA) * 8;
        roundRect(X(kx), Y(ky + lift), kw * s, kh * s, kr * s);
        ctx.fillStyle = rgba(GLOW, 1);
        ctx.fill();
        txt("Algebra, unit 4", kx + 14, ky + lift + 18, 8.5, 400, "rgba(255,255,255,0.78)");
        txt("Linear equations", kx + 14, ky + lift + 36, 14, 600, "#ffffff");
        const prog = 0.6 + 0.08 * ease(seg(s4, 0.55, 0.85));
        txt(`${Math.round(prog * 100)}% complete`, kx + 14, ky + lift + 66, 8.5, 400, "rgba(255,255,255,0.85)");
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
        ctx.fillStyle = rgba(GLOW, 1);
        ctx.fill();

        ctx.globalAlpha = part(0.3);
        txt("This week", PX + 16, PY + 184, 10.5, 600, rgba(TEXT, 1));
        txt("See all", PX + PW - 16, PY + 184, 9, 400, rgba(TEXT, 0.5), "right");
        const tiles: [RGB, string, string, string][] = [
          [GLOW, "y=x", "Graphing lines", "6 lessons, due Thursday"],
          [[240, 170, 80], "?", "Word problems", "4 lessons, due Sunday"],
          [[80, 200, 130], "✓", "Quiz: equations", "15 minutes"],
        ];
        UI.rows.forEach(([x, y, rw, rh, r], i) => {
          ctx.globalAlpha = part(0.35 + i * 0.08);
          const dx = (1 - ctx.globalAlpha) * 10;
          roundRect(X(x + dx), Y(y), rw * s, rh * s, r * s);
          ctx.fillStyle = "#151c2b";
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.lineWidth = 1;
          ctx.stroke();
          roundRect(X(x + dx + 8), Y(y + 7.5), 23 * s, 23 * s, 7 * s);
          ctx.fillStyle = rgba(tiles[i][0], 0.18);
          ctx.fill();
          txt(tiles[i][1], x + dx + 20, y + 19.5, 8, 600, rgba(tiles[i][0], 1), "center");
          txt(tiles[i][2], x + dx + 40, y + 14, 10, 600, rgba(TEXT, 1));
          txt(tiles[i][3], x + dx + 40, y + 26, 8, 400, rgba(TEXT, 0.5));
        });

        const [bx, by, bw, bh, br] = UI.button;
        const press = Math.sin(Math.PI * seg(s4, 0.45, 0.62));
        const sc = 1 - 0.04 * press;
        ctx.globalAlpha = part(0.6);
        const done = s4 > 0.6;
        roundRect(X(bx + (bw * (1 - sc)) / 2), Y(by + (bh * (1 - sc)) / 2), bw * sc * s, bh * sc * s, br * s);
        ctx.fillStyle = rgba(TEXT, 1);
        ctx.fill();
        txt(done ? "Continue lesson" : "Start lesson", bx + bw / 2, by + bh / 2 + 0.5, 10.5, 600, SCREEN, "center");
        roundRect(X(PX + PW / 2 - 34), Y(PY + PH - 12), 68 * s, 3.5 * s, 2 * s);
        ctx.fillStyle = rgba(TEXT, 0.8);
        ctx.fill();
        ctx.restore();

        if (s4 < 0.3 && w > 420) {
          ctx.save();
          ctx.globalAlpha = part(0.7) * (1 - s4 / 0.3);
          const notes: [number, string][] = [
            [ky + kh / 2, "Primary task first"],
            [UI.rows[1][1] + 20, "Scannable list, big tap targets"],
            [by + bh / 2, "One clear next step"],
          ];
          for (const [ny, label] of notes) {
            ctx.strokeStyle = rgba(GLOW, 0.7);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(X(PX + PW + 6), Y(ny));
            ctx.lineTo(X(PX + PW + 22), Y(ny));
            ctx.stroke();
            txt(label, PX + PW + 28, ny, 10, 500, rgba(HOT, 1));
          }
          ctx.restore();
        }
      }

      /* --- region names, beside their glowing points --- */
      if (w > 360 && brainA > 0.05) {
        ctx.font = `500 ${Math.round(Math.max(11, 13 * s))}px ${font}`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (const r of Object.keys(hubScreen) as Region[]) {
          const name = REGION_NAMES[r];
          const [hx, hy, vis] = hubScreen[r]!;
          if (!name || vis < 0.08) continue;
          const ph = Math.max(20, 24 * s);
          const pw = ctx.measureText(name).width + ph * 0.9;
          const ly = hy - 26 * px1 - (1 - Math.min(1, vis)) * 6;
          ctx.globalAlpha = Math.min(1, vis * 1.3);
          roundRect(hx - pw / 2, ly - ph / 2, pw, ph, ph / 2);
          ctx.fillStyle = "rgba(9,12,19,0.82)";
          ctx.fill();
          ctx.strokeStyle = rgba(GLOW, 0.6);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = rgba(HOT, 1);
          ctx.fillText(name, hx, ly + 0.5);
          ctx.globalAlpha = 1;
        }
      }

      /* --- a tap, then confirmation --- */
      if (s4 > 0.001) {
        const [bx, by, bw, bh] = UI.button;
        const tx = bx + bw * 0.62, ty = by + bh * 0.6;
        const travel = ease(seg(s4, 0, 0.45));
        const sx0 = PX + PW + 70, sy0 = PY + PH + 30;
        const cx = sx0 + (tx - sx0) * travel + Math.sin(travel * Math.PI) * -18;
        const cy = sy0 + (ty - sy0) * travel;
        const curA = Math.min(seg(s4, 0, 0.12), 1 - seg(s4, 0.85, 1));
        const rp = seg(s4, 0.48, 0.78);
        if (rp > 0 && rp < 1) {
          ctx.save();
          roundRect(X(bx), Y(by), bw * s, bh * s, 19 * s);
          ctx.clip();
          ctx.fillStyle = rgba(GLOW, 0.35 * (1 - rp));
          ctx.beginPath();
          ctx.arc(X(tx), Y(ty), (6 + rp * 40) * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        if (curA > 0.01) {
          ctx.save();
          ctx.globalAlpha = curA;
          ctx.translate(X(cx), Y(cy));
          const kk = s * 1.1 * (1 - 0.12 * Math.sin(Math.PI * seg(s4, 0.45, 0.62)));
          ctx.scale(kk, kk);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, 17);
          ctx.lineTo(4.5, 13);
          ctx.lineTo(8, 20);
          ctx.lineTo(10.5, 19);
          ctx.lineTo(7, 12);
          ctx.lineTo(12.5, 12);
          ctx.closePath();
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.strokeStyle = SCREEN;
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.restore();
        }
        const ta = easeOut(seg(s4, 0.62, 0.8));
        if (ta > 0) {
          ctx.save();
          ctx.globalAlpha = ta;
          const ty0 = PY + 12 - (1 - ta) * 14;
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 14 * s;
          ctx.shadowOffsetY = 4 * s;
          roundRect(X(PX + 14), Y(ty0), (PW - 28) * s, 30 * s, 10 * s);
          ctx.fillStyle = rgba(TEXT, 1);
          ctx.fill();
          ctx.shadowColor = "transparent";
          ctx.beginPath();
          ctx.arc(X(PX + 30), Y(ty0 + 15), 6 * s, 0, Math.PI * 2);
          ctx.fillStyle = "#2f9e5b";
          ctx.fill();
          txt("✓", PX + 30, ty0 + 15.5, 7, 700, "#ffffff", "center");
          txt("Lesson started", PX + 42, ty0 + 15, 9.5, 500, SCREEN);
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
        <div className="sticky top-16 z-10 -mx-5 border-b border-rule bg-frame/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-24 lg:mx-0 lg:h-[calc(100vh-8rem)] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="flex h-[32vh] flex-col lg:h-full lg:justify-center">
            <canvas ref={canvasRef} aria-hidden className="h-full w-full font-sans lg:h-[80%]" />
            <div className="mt-2 flex flex-col items-center gap-2.5 lg:mt-6">
              <p className="text-center text-[15px] text-graphite-soft" aria-live="polite">
                {caption}
              </p>
              <p className="hidden text-center text-[12px] text-graphite-soft/70 lg:block">
                Points from fsaverage, an average of real MRI brain scans. A simplified map: each lobe leads certain functions, but thinking uses many regions together.
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
                    {step.when ? <span className="text-graphite-soft/70">, {step.when}</span> : null}
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
                        className="rounded-full bg-graphite px-6 py-3 text-[15px] font-medium text-frame transition-colors hover:bg-white"
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
