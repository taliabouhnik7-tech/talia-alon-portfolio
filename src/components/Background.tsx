"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Background: the CV as a walk.
 *
 * A girl walks a winding path down the page as the reader scrolls. Each turn
 * of the path is one step of the CV, and at each one she stops and uses her
 * phone. The screens get simpler and clearer from stop to stop, and she gets
 * each task right away: the point of the section is shown, not told. A child
 * can use what I design.
 */

type RGB = [number, number, number];
const GLOW: RGB = [93, 142, 255];
const HOT: RGB = [168, 210, 255];
const TEXT: RGB = [232, 236, 244];
const GREEN: RGB = [47, 170, 100];
const WARM: RGB = [240, 170, 80];
const SCREEN = "#0d1220";
const ROW = "#161d2c";

type Step = {
  where: string;
  when?: string;
  title: string;
  body: string;
  design: string;
  caption: string;
};

const steps: Step[] = [
  {
    where: "Ben Gurion University",
    when: "2021–2024",
    title: "B.Sc. in Cognitive & Brain Sciences, minor in math",
    body: "How people perceive, pay attention, remember and decide, and the research methods behind it: ask a clear question, test it, read the data honestly.",
    design: "Fewer choices per screen, a clear visual hierarchy, and decisions backed by evidence rather than taste.",
    caption: "Too many choices, then one clear one",
  },
  {
    where: "STEM instruction and private tutoring",
    when: "2020–2025",
    title: "Teaching math and science",
    body: "Math tutoring for children and teens, on my own and through the PERACH project, then teaching STEM at Technoda.",
    design: "I bring the same habit to user research: listen longer, find the real question, then design.",
    caption: "Listening before answering",
  },
  {
    where: "HackerU",
    when: "2025–2026",
    title: "UX/UI design program",
    body: "The full process on solo and team projects: research, personas, user flows, information architecture, wireframes, UI and prototypes.",
    design: "A process I still follow on every project, so nothing gets designed before it's understood.",
    caption: "Structure that is easy to scan",
  },
  {
    where: "Udemy",
    when: "2026",
    title: "Advanced Figma",
    body: "A certificate course in advanced Figma: building reusable components, responsive layouts and interactive prototypes.",
    design: "Organised files a developer can build from, not just screens that look right.",
    caption: "Pieces that behave the same everywhere",
  },
  {
    where: "Talia Alon Bakery",
    title: "Designed and launched my own product",
    body: "An ordering site and admin system for my home bakery. It's live, and real customers order from it.",
    design: "Taking a design all the way to a live product showed me what holds up once real customers use it.",
    caption: "Ordering in a few taps",
  },
  {
    where: "Ariel University",
    when: "Since September 2026",
    title: "Marketing communications coordinator",
    body: "My current role: coordinating the university's marketing communications.",
    design: "Daily practice in writing for a real audience and working with many people across an organisation.",
    caption: "A message that is easy to act on",
  },
  {
    where: "Now",
    title: "Looking for my next team",
    body: "Open to UX/UI roles at product companies and UX consultancies.",
    design: "",
    caption: "Simple enough for anyone",
  },
];
/* ---------- helpers ---------------------------------------------------- */

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const pop = (t: number) => {
  // overshoots a little, like something landing
  const c = 1.7;
  const x = clamp(t) - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
};
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// The path: a slalom with one turn per step.
const D = 230; // world distance between stops
const PATH_X = 222;
const SWING = 62;
const pathX = (wy: number) => PATH_X + SWING * Math.sin((wy / D) * Math.PI);
const stopY = (i: number) => (i + 0.5) * D;

// The big phone beside her: where each stop's screen is shown.
const CARD = { x: 352, y: 46, w: 176, h: 348, r: 26 };
const SC = { x: CARD.x + 10, y: CARD.y + 30, w: CARD.w - 20, h: CARD.h - 44 };

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(canvas).fontFamily;
    const n = steps.length;
    const prog = new Float32Array(n); // smoothed reading progress per step
    let lastActive = -2;
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

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      const q = Math.max(0, Math.min(r, w / 2, h / 2));
      ctx.moveTo(x + q, y);
      ctx.arcTo(x + w, y, x + w, y + h, q);
      ctx.arcTo(x + w, y + h, x, y + h, q);
      ctx.arcTo(x, y + h, x, y, q);
      ctx.arcTo(x, y, x + w, y, q);
      ctx.closePath();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prevT) / 1000);
      prevT = now;
      const vh = window.innerHeight;
      const k = reduce ? 1 : 1 - Math.exp(-dt * 6);
      const els = stepRefs.current;
      if (!els[0]) {
        if (running) frame = requestAnimationFrame(tick);
        return;
      }
      for (let i = 0; i < n; i++) {
        const r = els[i]!.getBoundingClientRect();
        const span = i === n - 1 ? Math.max(1, r.height - vh * 0.5) : r.height;
        const goal = clamp((vh * 0.62 - r.top) / span);
        prog[i] += (goal - prog[i]) * k;
      }
      let act = -1;
      for (let i = 0; i < n; i++) if (prog[i] > 0.02) act = i;
      if (act !== lastActive) {
        lastActive = act;
        setActive(act);
      }
      try {
        draw(now / 1000);
      } catch (err) {
        console.error(err);
      }
      if (running) frame = requestAnimationFrame(tick);
    };

    /* ---------- the girl -------------------------------------------------- */

    const girl = (
      X: (x: number) => number,
      Y: (y: number) => number,
      s: number,
      x: number,
      y: number,
      o: { face: number; walk: number; phase: number; phone: number; happy: number; wave: number; puzzled: number; t: number },
    ) => {
      const sx = (v: number) => X(x + v * o.face);
      const sy = (v: number) => Y(y + v);
      const SKIN = "#f0c9a8", SKIN_D = "#d9a989", HAIR = "#2b1b14", DRESS = rgba(GLOW, 1), DRESS_D = "#3f68cf";
      const limb = (pts: [number, number][], wdt: number, col: string) => {
        ctx.beginPath();
        pts.forEach(([a, b], i) => (i ? ctx.lineTo(sx(a), sy(b)) : ctx.moveTo(sx(a), sy(b))));
        ctx.lineWidth = wdt * s;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = col;
        ctx.stroke();
      };
      const bob = Math.abs(Math.sin(o.phase)) * 1.4 * o.walk;
      const hip = -24 - bob;
      const sh = -45 - bob;
      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(X(x), Y(y + 1), 12 * s, 3 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      // legs, with little shoes
      const leg = Math.sin(o.phase) * 0.5 * o.walk;
      const legs: [number, number][][] = [1, -1].map((sgn) => {
        const a = leg * sgn;
        const kx = Math.sin(a) * 11.5, ky = hip + Math.cos(a) * 11.5;
        const fx = kx + Math.sin(a * 0.5) * 12, fy = Math.min(-1, ky + 12.5);
        return [[sgn * 2.2, hip], [kx + sgn * 2.2, ky], [fx + sgn * 2.2, fy]] as [number, number][];
      });
      legs.forEach((pts, j) => {
        limb(pts, 3.4, j ? SKIN_D : SKIN);
        const [fx, fy] = pts[2];
        ctx.fillStyle = j ? "#1b2233" : "#262f45";
        ctx.beginPath();
        ctx.ellipse(sx(fx + 1.5), sy(fy + 0.5), 3.4 * s, 1.9 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      // back arm (behind the dress)
      const swing = Math.sin(o.phase) * 0.55 * o.walk * (1 - o.phone);
      limb([[-3, sh + 3], [-3 - Math.sin(swing) * 6, sh + 10], [-3 - Math.sin(swing) * 10, sh + 17]], 3, SKIN_D);
      // dress
      const grd = ctx.createLinearGradient(sx(0), sy(sh), sx(0), sy(hip + 5));
      grd.addColorStop(0, DRESS);
      grd.addColorStop(1, DRESS_D);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(sx(-5.5), sy(sh + 1));
      ctx.quadraticCurveTo(sx(0), sy(sh - 1.5), sx(5.5), sy(sh + 1));
      ctx.lineTo(sx(11 + Math.sin(o.phase) * o.walk), sy(hip + 5));
      ctx.quadraticCurveTo(sx(0), sy(hip + 7.5), sx(-11 + Math.sin(o.phase) * o.walk), sy(hip + 5));
      ctx.closePath();
      ctx.fill();
      // front arm: swinging, holding the phone, or waving
      if (o.wave > 0.01) {
        const wv = Math.sin(o.t * 8) * 0.5 * o.wave;
        limb([[3.5, sh + 3], [9, sh - 5], [10 + wv * 7, sh - 15]], 3, SKIN);
        ctx.fillStyle = SKIN;
        ctx.beginPath();
        ctx.arc(sx(10 + wv * 7), sy(sh - 16), 2.4 * s, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.phone > 0.01) {
        const hx = 11, hy = sh + 2 - o.phone * 4;
        limb([[3.5, sh + 3], [9, sh + 11], [hx, hy + 2]], 3, SKIN);
        ctx.save();
        ctx.globalAlpha *= o.phone;
        rr(sx(hx) - (o.face < 0 ? 6 * s : 0), sy(hy - 9), 6 * s, 10.5 * s, 1.6 * s);
        ctx.fillStyle = "#121827";
        ctx.fill();
        rr(sx(hx) - (o.face < 0 ? 6 * s : 0) + 0.9 * s, sy(hy - 8), 4.2 * s, 8.5 * s, 1 * s);
        ctx.fillStyle = rgba(GLOW, 0.9);
        ctx.fill();
        ctx.restore();
      } else {
        limb([[3.5, sh + 3], [3.5 + Math.sin(-swing) * 6, sh + 10], [3.5 + Math.sin(-swing) * 10, sh + 17]], 3, SKIN);
      }
      // neck and head
      limb([[0, sh], [0.5, sh - 4]], 3, SKIN);
      const hy = sh - 11;
      const tail = Math.sin(o.phase * 2) * o.walk;
      // ponytail behind the head
      ctx.fillStyle = HAIR;
      ctx.beginPath();
      ctx.ellipse(sx(-10.5 - tail), sy(hy + 2), 3.4 * s, 7 * s, o.face * (0.45 + tail * 0.15), 0, Math.PI * 2);
      ctx.fill();
      // hair as a full shape, then the face sits in front of it
      ctx.fillStyle = HAIR;
      ctx.beginPath();
      ctx.arc(sx(-0.6), sy(hy - 0.8), 8 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = SKIN;
      ctx.beginPath();
      ctx.ellipse(sx(2.1), sy(hy + 1.4), 6 * s, 6.4 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      // bangs
      ctx.fillStyle = HAIR;
      ctx.beginPath();
      ctx.moveTo(sx(-2), sy(hy - 5));
      ctx.quadraticCurveTo(sx(4), sy(hy - 8.6), sx(8), sy(hy - 2.2));
      ctx.quadraticCurveTo(sx(4), sy(hy - 4.2), sx(-1), sy(hy - 1.5));
      ctx.closePath();
      ctx.fill();
      // face: looks down at the phone while she uses it
      const look = o.phone * 1.6;
      ctx.fillStyle = "#2a1c16";
      ctx.beginPath();
      ctx.arc(sx(5.4), sy(hy + 0.8 + look * 0.6), 1.05 * s, 0, Math.PI * 2);
      ctx.arc(sx(2), sy(hy + 0.8 + look * 0.6), 1.05 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(240,120,120,0.35)";
      ctx.beginPath();
      ctx.arc(sx(6.4), sy(hy + 3.6), 1.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#7a3b2c";
      ctx.lineWidth = 1.1 * s;
      ctx.beginPath();
      const m = o.happy;
      ctx.moveTo(sx(2.4), sy(hy + 4.4 + look * 0.4));
      ctx.quadraticCurveTo(sx(3.9), sy(hy + 4.4 + look * 0.4 + 2 * m - 0.8 * o.puzzled), sx(5.6), sy(hy + 4.2 + look * 0.4 - 0.4 * o.puzzled));
      ctx.stroke();
      // a question mark when a screen confuses her, a spark when it works
      if (o.puzzled > 0.02) {
        ctx.globalAlpha = o.puzzled;
        ctx.font = `700 ${15 * s}px ${font}`;
        ctx.textAlign = "center";
        ctx.fillStyle = rgba(WARM, 1);
        ctx.fillText("?", sx(6), sy(hy - 16 - Math.sin(o.t * 4) * 1.5));
        ctx.globalAlpha = 1;
      }
      if (o.happy > 0.5) {
        const a = (o.happy - 0.5) * 2;
        ctx.strokeStyle = rgba(HOT, a);
        ctx.lineWidth = 1.6 * s;
        for (let i = 0; i < 4; i++) {
          const ang = -Math.PI / 2 + (i - 1.5) * 0.55;
          const r0 = 15 + (1 - a) * 4, r1 = 20 + a * 2;
          ctx.beginPath();
          ctx.moveTo(sx(Math.cos(ang) * r0), sy(hy + Math.sin(ang) * r0));
          ctx.lineTo(sx(Math.cos(ang) * r1), sy(hy + Math.sin(ang) * r1));
          ctx.stroke();
        }
      }
    };

    /* ---------- the screens ------------------------------------------------ */

    // Draws stop i's screen at local progress q (0..1). Returns where she taps
    // and when, so the ripple and her reaction line up with the screen.
    const screen = (
      i: number,
      q: number,
      X: (x: number) => number,
      Y: (y: number) => number,
      s: number,
    ): { tap: [number, number] | null } => {
      const { x, y, w, h } = SC;
      const box = (bx: number, by: number, bw: number, bh: number, r: number, fill: string) => {
        rr(X(bx), Y(by), bw * s, bh * s, r * s);
        ctx.fillStyle = fill;
        ctx.fill();
      };
      const txt = (str: string, tx: number, ty: number, size: number, weight: number, color: string, align: CanvasTextAlign = "left") => {
        ctx.font = `${weight} ${size * s}px ${font}`;
        ctx.textAlign = align;
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.fillText(str, X(tx), Y(ty));
      };
      const W1 = rgba(TEXT, 0.95), W2 = rgba(TEXT, 0.55), INK = "#0d1220";
      const check = (cx: number, cy: number, r: number, a: number) => {
        if (a <= 0) return;
        ctx.globalAlpha = a;
        ctx.fillStyle = rgba(GREEN, 1);
        ctx.beginPath();
        ctx.arc(X(cx), Y(cy), r * s * pop(a), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2.6 * s;
        ctx.beginPath();
        ctx.moveTo(X(cx - r * 0.4), Y(cy));
        ctx.lineTo(X(cx - r * 0.1), Y(cy + r * 0.32));
        ctx.lineTo(X(cx + r * 0.45), Y(cy - r * 0.3));
        ctx.stroke();
        ctx.globalAlpha = 1;
      };
      const title = (str: string) => txt(str, x + 10, y + 16, 15, 700, W1);
      const done = (str: string, at: number) => {
        const a = seg(q, at, at + 0.1);
        if (a <= 0) return;
        ctx.globalAlpha = a * 0.92;
        box(x, y, w, h, 12, SCREEN);
        ctx.globalAlpha = 1;
        check(x + w / 2, y + h / 2 - 14, 24, a);
        ctx.globalAlpha = a;
        txt(str, x + w / 2, y + h / 2 + 26, 14, 700, W1, "center");
        ctx.globalAlpha = 1;
      };

      if (i === 0) {
        // Before: twelve look-alike buttons. After: one clear button.
        const g = ease(seg(q, 0.42, 0.6));
        const words = ["Sync", "Edit", "Info", "Tools", "Share", "More", "Go", "Next", "Open", "Help", "Set", "Start"];
        title("Home");
        for (let r = 0; r < 4; r++)
          for (let c = 0; c < 3; c++) {
            const bx = x + 8 + c * 44, by = y + 36 + r * 42;
            ctx.globalAlpha = 1 - g;
            box(bx, by, 40, 36, 6, ROW);
            txt(words[r * 3 + c], bx + 20, by + 18, 9.5, 500, W2, "center");
            ctx.globalAlpha = 1;
          }
        if (g > 0) {
          ctx.globalAlpha = g;
          txt("Ready when you are", x + w / 2, y + 100, 11, 500, W2, "center");
          box(x + 16, y + 122, w - 32, 46, 23, rgba(GLOW, 1));
          txt("Start", x + w / 2, y + 145, 16, 700, "#fff", "center");
          ctx.globalAlpha = 1;
        }
        done("Started", 0.8);
        return { tap: [x + w / 2, y + 145] };
      }

      if (i === 1) {
        // A student asks, she answers in plain words.
        title("Chat");
        const b1 = easeOut(seg(q, 0.04, 0.2));
        ctx.globalAlpha = b1;
        box(x + 8, y + 38, 110, 34, 12, ROW);
        txt("I don't get fractions", x + 16, y + 55, 10, 500, W1);
        ctx.globalAlpha = 1;
        const b2 = easeOut(seg(q, 0.56, 0.7));
        ctx.globalAlpha = b2;
        box(x + w - 120, y + 84, 112, 34, 12, rgba(GLOW, 1));
        txt("Let's try it with pizza", x + w - 112, y + 101, 10, 600, "#fff");
        ctx.globalAlpha = 1;
        // what she types
        const typed = "Let's try it with pizza".slice(0, Math.floor(23 * seg(q, 0.2, 0.42)));
        box(x + 8, y + h - 40, w - 16, 30, 15, ROW);
        if (q < 0.56) txt(typed || "Message", x + 18, y + h - 25, 10, 500, typed ? W1 : W2);
        box(x + w - 36, y + h - 37, 24, 24, 12, rgba(GLOW, 1));
        txt("↑", x + w - 24, y + h - 25, 12, 700, "#fff", "center");
        done("Sent", 0.78);
        return { tap: [x + w - 24, y + h - 25] };
      }

      if (i === 2) {
        // A clear list, easy to scan; she scrolls and picks one.
        title("Lessons");
        const items = ["Fractions", "Decimals", "Percentages", "Ratios", "Graphs", "Equations"];
        const tones: RGB[] = [GLOW, WARM, GREEN, HOT, GLOW, WARM];
        const scroll = ease(seg(q, 0.3, 0.55)) * 84;
        ctx.save();
        rr(X(x), Y(y + 32), w * s, (h - 32) * s, 0);
        ctx.clip();
        items.forEach((it, r) => {
          const by = y + 36 + r * 44 - scroll;
          const picked = r === 3 && q > 0.66;
          box(x + 8, by, w - 16, 38, 10, picked ? rgba(GLOW, 0.35) : ROW);
          box(x + 15, by + 8, 22, 22, 7, rgba(tones[r], 0.85));
          txt(it, x + 45, by + 14, 11, 600, W1);
          txt(`${4 + r} lessons`, x + 45, by + 27, 8.5, 500, W2);
        });
        ctx.restore();
        done("Lesson opened", 0.78);
        return { tap: q < 0.58 ? [x + w / 2 + 20, y + 200 - scroll * 1.1] : [x + w / 2, y + 36 + 3 * 44 - 84 + 19] };
      }

      if (i === 3) {
        // Three cards made from the same component; she opens one.
        title("Courses");
        const names = ["Math", "Science", "Art"];
        const tones: RGB[] = [GLOW, GREEN, WARM];
        const open = ease(seg(q, 0.55, 0.72));
        names.forEach((nm, c) => {
          const a = pop(seg(q, 0.04 + c * 0.1, 0.22 + c * 0.1));
          if (a <= 0) return;
          const by = y + 38 + c * 70;
          const sel = c === 1;
          ctx.globalAlpha = clamp(a) * (sel ? 1 : 1 - open * 0.6);
          box(x + 8, by, w - 16, 62, 12, sel && open > 0 ? rgba(GLOW, 0.25 + 0.6 * open) : ROW);
          box(x + 16, by + 14, 34, 34, 9, rgba(tones[c], 0.9));
          txt(nm, x + 58, by + 24, 12, 700, W1);
          txt("8 lessons", x + 58, by + 40, 9, 500, W2);
          ctx.globalAlpha = 1;
        });
        done("Course opened", 0.78);
        return { tap: [x + w / 2 + 10, y + 38 + 70 + 31] };
      }

      if (i === 4) {
        // Pick a pastry, add one more, order.
        title("Bakery");
        box(x + 8, y + 34, w - 16, 108, 14, ROW);
        const bx = x + w / 2, by = y + 82;
        const grd = ctx.createRadialGradient(X(bx - 8), Y(by - 10), 2, X(bx), Y(by), 36 * s);
        grd.addColorStop(0, "#f2c27b");
        grd.addColorStop(1, "#b5702f");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.ellipse(X(bx), Y(by), 36 * s, 26 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,240,215,0.6)";
        ctx.lineWidth = 2 * s;
        for (const d of [-13, 0, 13]) {
          ctx.beginPath();
          ctx.arc(X(bx + d), Y(by - 2), 11 * s, Math.PI * 1.15, Math.PI * 1.85);
          ctx.stroke();
        }
        txt("Fresh bun", x + 12, y + 156, 13, 700, W1);
        const count = q > 0.36 ? 2 : 1;
        box(x + 12, y + 172, 78, 28, 14, ROW);
        txt("–", x + 26, y + 186, 13, 600, W1, "center");
        txt(String(count), x + 51, y + 186, 12, 700, W1, "center");
        box(x + 64, y + 175, 22, 22, 11, rgba(GLOW, 1));
        txt("+", x + 75, y + 186, 13, 700, "#fff", "center");
        const press = Math.sin(Math.PI * seg(q, 0.64, 0.72));
        box(x + 12 + press * 2, y + h - 50 + press, w - 24 - press * 4, 38, 19, rgba(TEXT, 0.95));
        txt("Order", x + w / 2, y + h - 31, 14, 700, INK, "center");
        done("Ordered", 0.76);
        return { tap: q < 0.5 ? [x + 75, y + 186] : [x + w / 2, y + h - 31] };
      }

      if (i === 5) {
        // A notification she understands at a glance.
        const icons: RGB[] = [GLOW, WARM, GREEN, HOT, WARM, GLOW, GREEN, HOT];
        const opened = ease(seg(q, 0.55, 0.72));
        txt("9:41", x + w / 2, y + 40, 26, 300, W1, "center");
        for (let c = 0; c < 8; c++) {
          const ix = x + 16 + (c % 4) * 32, iy = y + 120 + Math.floor(c / 4) * 40;
          ctx.globalAlpha = 1 - opened * 0.8;
          box(ix, iy, 24, 24, 7, rgba(icons[c], 0.75));
          ctx.globalAlpha = 1;
        }
        const n1 = easeOut(seg(q, 0.12, 0.3));
        const ny = y + 64 - (1 - n1) * 90 - opened * 40;
        const nh = 44 + opened * 150;
        ctx.globalAlpha = n1;
        box(x + 8, ny, w - 16, nh, 12, rgba(TEXT, 0.96));
        box(x + 15, ny + 10, 24, 24, 7, rgba(WARM, 1));
        txt("Bakery", x + 46, ny + 15, 9, 600, "rgba(13,18,32,0.55)");
        txt("Your order is ready", x + 46, ny + 29, 10.5, 700, INK);
        if (opened > 0.2) {
          ctx.globalAlpha = n1 * opened;
          txt("Pick it up today", x + 16, ny + 62, 10, 500, "rgba(13,18,32,0.7)");
          txt("until 6 pm.", x + 16, ny + 76, 10, 500, "rgba(13,18,32,0.7)");
          box(x + 16, ny + nh - 40, w - 32, 30, 15, rgba(GLOW, 1));
          txt("Got it", x + w / 2, ny + nh - 25, 12, 700, "#fff", "center");
        }
        ctx.globalAlpha = 1;
        return { tap: q < 0.62 ? [x + w / 2, y + 86] : [x + w / 2, y + 24 + 194 - 25] };
      }

      // Last stop: one button. She taps it, then waves to you.
      const press = Math.sin(Math.PI * seg(q, 0.42, 0.5));
      txt("Talia Alon", x + w / 2, y + 70, 15, 700, W1, "center");
      txt("UX/UI designer", x + w / 2, y + 88, 10.5, 500, W2, "center");
      box(x + 16 + press * 2, y + 140 + press, w - 32 - press * 4, 46, 23, rgba(GLOW, 1));
      txt("Say hi", x + w / 2, y + 163, 15, 700, "#fff", "center");
      done("Message sent", 0.54);
      return { tap: [x + w / 2, y + 163] };
    };

    // A finger that comes in, presses, and leaves.
    const finger = (X: (x: number) => number, Y: (y: number) => number, s: number, tx: number, ty: number, k: number, press: number) => {
      if (k <= 0) return;
      const off = (1 - easeOut(k)) * 70;
      const fx = tx + off * 0.6, fy = ty + off;
      ctx.save();
      ctx.globalAlpha = Math.min(1, k * 2);
      ctx.translate(X(fx), Y(fy));
      ctx.rotate(-0.35);
      const sc = (1 - 0.08 * press) * s;
      ctx.scale(sc, sc);
      ctx.fillStyle = "#f0c9a8";
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-7, 2);
      ctx.arcTo(-7, -9, 0, -9, 7);
      ctx.arcTo(7, -9, 7, 2, 7);
      ctx.lineTo(9, 60);
      ctx.lineTo(-9, 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.ellipse(0, -3, 4, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    /* ---------- one frame --------------------------------------------------- */

    const draw = (t: number) => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);
      const s = Math.min(w / 610, h / 440);
      const ox = (w - 610 * s) / 2;
      const oy = (h - 440 * s) / 2;
      const X = (x: number) => ox + x * s;
      const Y = (y: number) => oy + y * s;

      // where she is on the path: she walks to the next stop at the start of
      // each step, then stays there while the step is read
      let p = 0;
      for (let i = 1; i < n; i++) p += ease(seg(prog[i], 0, 0.32));
      const stop = Math.min(n - 1, Math.round(p));
      const at = clamp(1 - Math.abs(p - stop) * 3.5); // 1 when standing at a stop
      const q = seg(prog[stop], stop === 0 ? 0.05 : 0.34, 0.92);
      const wy = (p + 0.5) * D;
      const walk = 1 - at;

      // the camera follows her, with the path drawn in world space
      const GX = 0, GY = 330; // her feet on screen
      const toY = (y: number) => GY + (y - wy) * 0.85;
      ctx.lineCap = "round";
      // future path, dashed and dim
      ctx.setLineDash([2 * s, 7 * s]);
      ctx.strokeStyle = rgba(TEXT, 0.22);
      ctx.lineWidth = 2.2 * s;
      ctx.beginPath();
      for (let yy = wy; yy < wy + 420; yy += 6) {
        const px = X(pathX(yy) + GX), py = Y(toY(yy));
        if (yy === wy) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      // walked path, glowing
      ctx.strokeStyle = rgba(GLOW, 0.85);
      ctx.lineWidth = 3 * s;
      ctx.shadowColor = rgba(GLOW, 0.6);
      ctx.shadowBlur = 10 * s;
      ctx.beginPath();
      for (let yy = Math.max(0, wy - 420); yy <= wy; yy += 6) {
        const px = X(pathX(yy) + GX), py = Y(toY(yy));
        if (yy === Math.max(0, wy - 420)) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      // the stops
      for (let i = 0; i < n; i++) {
        const sy = toY(stopY(i));
        if (sy < -40 || sy > 480) continue;
        const reached = p >= i - 0.02;
        const sxp = pathX(stopY(i));
        ctx.fillStyle = reached ? rgba(GLOW, 1) : "#0f1522";
        ctx.strokeStyle = reached ? rgba(HOT, 0.9) : rgba(TEXT, 0.3);
        ctx.lineWidth = 1.6 * s;
        ctx.beginPath();
        ctx.ellipse(X(sxp), Y(sy), 16 * s, 6 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.font = `600 ${11 * s}px ${font}`;
        ctx.textAlign = sxp > PATH_X ? "left" : "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = reached ? rgba(HOT, 0.95) : rgba(TEXT, 0.35);
        ctx.globalAlpha = clamp(Math.abs(p - i) * 2.5); // her own stop needs no number
        ctx.fillText(String(i + 1).padStart(2, "0"), X(sxp + (sxp > PATH_X ? 24 : -24)), Y(sy));
        ctx.globalAlpha = 1;
      }

      // which way she faces: the direction the path turns under her feet
      const G = 4; // her size
      const dir = Math.cos((wy / D) * Math.PI) >= 0 ? 1 : -1;
      const gxp = pathX(wy);
      // when she taps and when each screen confirms, so her face reacts in sync
      const TIMING: [number, number][] = [[0.7, 0.8], [0.5, 0.78], [0.62, 0.78], [0.52, 0.78], [0.68, 0.76], [0.5, 0.75], [0.44, 0.54]];
      const [tapAt, doneAt] = TIMING[stop];
      const puzzled = stop === 0 ? seg(q, 0.12, 0.25) * (1 - seg(q, 0.45, 0.55)) : 0;
      const phone = at * ease(seg(q, 0, 0.12)) * (stop === n - 1 ? 1 - seg(q, 0.7, 0.8) : 1);
      girl(X, Y, s * G, gxp, GY, {
        face: walk > 0.3 ? dir : 1,
        walk,
        phase: wy * 0.11,
        phone,
        happy: at * seg(q, doneAt, doneAt + 0.1),
        wave: stop === n - 1 ? at * seg(q, 0.72, 0.82) : 0,
        puzzled: at * puzzled,
        t,
      });

      // the big phone: what she sees
      const cardA = at * ease(seg(q, 0, 0.14));
      if (cardA > 0.01) {
        ctx.save();
        ctx.globalAlpha = cardA;
        // zoom lines from her phone to the big one
        const hpx = X(gxp + 14 * G), hpy = Y(GY - 52 * G);
        ctx.strokeStyle = rgba(GLOW, 0.25);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(hpx, hpy);
        ctx.lineTo(X(CARD.x), Y(CARD.y + 20));
        ctx.moveTo(hpx, hpy + 8 * s);
        ctx.lineTo(X(CARD.x), Y(CARD.y + CARD.h - 20));
        ctx.stroke();
        ctx.setLineDash([]);
        const lift = (1 - cardA) * 14;
        ctx.translate(0, lift * s);
        ctx.shadowColor = rgba(GLOW, 0.3);
        ctx.shadowBlur = 30 * s;
        rr(X(CARD.x), Y(CARD.y), CARD.w * s, CARD.h * s, CARD.r * s);
        ctx.fillStyle = SCREEN;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.stroke();
        rr(X(CARD.x + CARD.w / 2 - 22), Y(CARD.y + 9), 44 * s, 12 * s, 6 * s);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.save();
        rr(X(SC.x), Y(SC.y), SC.w * s, SC.h * s, 12 * s);
        ctx.clip();
        const r2 = screen(stop, q, X, Y, s);
        ctx.restore();
        // her tap: a ripple where her finger lands
        if (r2.tap) {
          // the finger comes in before the tap and leaves after
          const near = seg(q, tapAt - 0.16, tapAt - 0.02) * (1 - seg(q, tapAt + 0.08, tapAt + 0.16));
          const press = Math.sin(Math.PI * seg(q, tapAt - 0.03, tapAt + 0.05));
          const tp = seg(q, tapAt - 0.02, tapAt + 0.12);
          if (tp > 0 && tp < 1) {
            ctx.strokeStyle = rgba(HOT, 1 - tp);
            ctx.fillStyle = rgba(HOT, 0.3 * (1 - tp));
            ctx.lineWidth = 2 * s;
            ctx.beginPath();
            ctx.arc(X(r2.tap[0]), Y(r2.tap[1]), (6 + tp * 18) * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          // the earlier tap at stops with two taps (add one, then order / open)
          if ((stop === 4 && q < 0.5) || (stop === 5 && q < 0.62) || (stop === 2 && q < 0.58)) {
            const t0 = stop === 4 ? 0.36 : stop === 5 ? 0.38 : 0.3;
            const k0 = seg(q, t0 - 0.12, t0) * (1 - seg(q, t0 + 0.06, t0 + 0.12));
            finger(X, Y, s, r2.tap[0], r2.tap[1], k0, Math.sin(Math.PI * seg(q, t0 - 0.03, t0 + 0.04)));
          } else {
            finger(X, Y, s, r2.tap[0], r2.tap[1], near, press);
          }
        }
        // the first stop names the change: before and after
        if (stop === 0) {
          const after = seg(q, 0.45, 0.55);
          ctx.font = `700 ${12 * s}px ${font}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = after > 0.5 ? rgba(GREEN, 1) : rgba(WARM, 1);
          ctx.fillText(after > 0.5 ? "After" : "Before", X(CARD.x + CARD.w / 2), Y(CARD.y - 14));
        }
        ctx.restore();
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

  const caption = steps[Math.max(0, active)].caption;

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
