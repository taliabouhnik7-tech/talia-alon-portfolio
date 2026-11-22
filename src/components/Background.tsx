"use client";

import { useEffect, useRef, useState } from "react";
import { edges, nodes, outline, type Region } from "@/data/brain";

/*
 * Background: one set of particles that keeps changing shape as you scroll.
 *
 *   brain  ->  pours onto a chalkboard  ->  bursts into sticky notes
 *          ->  snaps into Figma frames  ->  folds into a shipped app
 *
 * Every frame is a pure function of scroll position, so scrolling back up
 * plays it in reverse. The same particles travel the whole way; each shape's
 * solid artwork only fades in once its particles have arrived.
 */

type RGB = [number, number, number];
type C2D = CanvasRenderingContext2D;
type Mode = "mask" | "render";

const COBALT: RGB = [53, 82, 242];
const INK: RGB = [26, 29, 34];
const CHALK: RGB = [245, 244, 238];

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
    regionLabel: "How people perceive, remember and decide",
  },
  {
    where: "STEM instruction and private tutoring",
    title: "Teaching math one on one",
    body: "Years of sessions with students who were stuck. The question they asked was rarely the real problem.",
    design: "This is how I run interviews and usability tests: listen longer, find the real question, then design.",
    regions: ["temporal", "frontal"],
    regionLabel: "Explaining one idea five different ways",
  },
  {
    where: "HackerU",
    title: "UX/UI design program",
    body: "The full process on solo and team projects: research, personas, user flows, information architecture, wireframes, UI and prototypes.",
    design: "A process I still follow on every project, so nothing gets designed before it's understood.",
    regions: ["parietal", "occipital"],
    regionLabel: "Interviews, personas, user flows",
  },
  {
    where: "Udemy",
    title: "Advanced Figma",
    body: "Components, variants, auto layout, variables and interactive prototypes.",
    design: "Files a developer can build from, and design systems that hold up past the first screen.",
    regions: ["cerebellum", "parietal"],
    regionLabel: "Frames, components, auto layout",
  },
  {
    where: "Talia Alon Bakery",
    title: "Designed, built and launched my own product",
    body: "An ordering site and admin system for my home bakery. It's live, and real customers order from it.",
    design: "I know what happens after handoff, because I've been on both sides of it.",
    regions: ["frontal", "parietal", "temporal", "occipital", "cerebellum", "stem"],
    regionLabel: "Designed, built and shipped",
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
// While the first step scrolls in, regions light up one after another.
const LIGHT_AT: Record<Region, number> = { occipital: 0, temporal: 0.2, frontal: 0.4, parietal: 0.6, cerebellum: 0.75, stem: 0.85 };
const N = nodes.length;
const BCX = 300, BCY = 215;

/* ---------- small math ------------------------------------------------ */
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (x: number) => x * x * (3 - 2 * x);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const backOut = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rand = (i: number, k: number) => {
  const v = Math.sin(i * k) * 43758.5453;
  return v - Math.floor(v);
};
const bez = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

/* ---------- brain geometry ------------------------------------------- */
const centroids = REGIONS.reduce(
  (acc, r) => {
    const pts = nodes.filter((n) => n.r === r);
    acc[r] = [pts.reduce((a, n) => a + n.x, 0) / pts.length, pts.reduce((a, n) => a + n.y, 0) / pts.length];
    return acc;
  },
  {} as Record<Region, [number, number]>
);
const nodeDist = nodes.map((n) => Math.hypot(n.x - centroids[n.r][0], n.y - centroids[n.r][1]));
const depthZ = nodes.map((n, i) => {
  const dx = (n.x - BCX) / 270, dy = (n.y - BCY) / 210;
  return (rand(i, 78.233) * 2 - 1) * Math.sqrt(Math.max(0.05, 1 - dx * dx - dy * dy)) * 120;
});
const dust = nodes.map((_, i) => {
  const a = i * 2.39996, r = 230 + rand(i, 3.17) * 160;
  return [BCX + Math.cos(a) * r * 1.25, BCY + Math.sin(a) * r * 0.75] as [number, number];
});

/* ---------- the four shapes after the brain --------------------------- */
// Each shape is drawn by one function, used twice: in "mask" mode to sample
// target points for the particles, and in "render" mode as the solid artwork.

const HAND = "italic 600 1px Georgia, 'Times New Roman', serif";
const font = (base: string, size: number) => base.replace("1px", `${size}px`);
let SANS = "system-ui, sans-serif";

function chalkboard(c: C2D, mode: Mode, w = 1) {
  const m = mode === "mask";
  if (!m) {
    c.globalAlpha = w;
    c.fillStyle = "#24292e";
    c.beginPath();
    c.roundRect(118, 56, 374, 266, 14);
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.08)";
    c.lineWidth = 6;
    c.stroke();
  }
  c.globalAlpha = m ? 1 : w;
  c.fillStyle = m ? "#000" : rgba(CHALK, 0.95);
  c.strokeStyle = m ? "#000" : rgba(CHALK, 0.7);
  c.font = font(HAND, 46);
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("y = 2x + 1", 305, 122);
  c.lineWidth = m ? 2.5 : 2;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(178, 292);
  c.lineTo(440, 292);
  c.moveTo(192, 302);
  c.lineTo(192, 176);
  c.stroke();
  c.strokeStyle = m ? "#000" : "rgba(246,231,161,0.95)";
  c.lineWidth = m ? 3 : 2.6;
  c.beginPath();
  c.moveTo(204, 282);
  c.lineTo(424, 186);
  c.stroke();
  if (!m) {
    c.fillStyle = "rgba(246,231,161,0.95)";
    for (const [x, y] of [[254, 260], [314, 234], [374, 208]]) {
      c.beginPath();
      c.arc(x, y, 3.6, 0, Math.PI * 2);
      c.fill();
    }
    c.font = font(HAND, 15);
    c.fillStyle = rgba(CHALK, 0.6);
    c.fillText("what changes when x grows?", 305, 160);
  }
  c.globalAlpha = 1;
}

const NOTES: { x: number; y: number; r: number; fill: string; label: string }[] = [
  { x: 112, y: 92, r: -0.05, fill: "#ffe48a", label: "Interviews" },
  { x: 250, y: 196, r: 0.04, fill: "#ffc9dc", label: "Persona" },
  { x: 388, y: 96, r: -0.03, fill: "#c4e2ff", label: "User flow" },
];
function stickyNotes(c: C2D, mode: Mode, w = 1) {
  const m = mode === "mask";
  c.globalAlpha = m ? 1 : w;
  // arrows
  c.strokeStyle = m ? "#000" : rgba(INK, 0.55);
  c.lineWidth = m ? 2.5 : 1.6;
  c.setLineDash(m ? [] : [5, 5]);
  c.beginPath();
  c.moveTo(178, 196);
  c.quadraticCurveTo(190, 250, 244, 250);
  c.moveTo(366, 250);
  c.quadraticCurveTo(420, 250, 438, 198);
  c.stroke();
  c.setLineDash([]);
  if (!m) {
    c.fillStyle = rgba(INK, 0.55);
    for (const [x, y, a] of [[244, 250, 0], [438, 198, -1.2]] as [number, number, number][]) {
      c.save();
      c.translate(x, y);
      c.rotate(a);
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-8, -4.5);
      c.lineTo(-8, 4.5);
      c.closePath();
      c.fill();
      c.restore();
    }
  }
  for (const n of NOTES) {
    c.save();
    c.translate(n.x + 55, n.y + 48);
    c.rotate(n.r);
    if (m) {
      c.strokeStyle = "#000";
      c.lineWidth = 2.5;
      c.strokeRect(-55, -48, 110, 96);
    } else {
      c.shadowColor = "rgba(26,29,34,0.16)";
      c.shadowBlur = 14;
      c.shadowOffsetY = 6;
      c.fillStyle = n.fill;
      c.fillRect(-55, -48, 110, 96);
      c.shadowColor = "transparent";
    }
    c.fillStyle = m ? "#000" : rgba(INK, 0.9);
    c.font = font(HAND, 17);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(n.label, 0, -6);
    if (!m) {
      c.strokeStyle = rgba(INK, 0.25);
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(-30, 18);
      c.lineTo(28, 18);
      c.moveTo(-30, 28);
      c.lineTo(12, 28);
      c.stroke();
    }
    c.restore();
  }
  c.globalAlpha = 1;
}

const FRAMES = [
  { x: 120, label: "Home" },
  { x: 253, label: "Menu" },
  { x: 386, label: "Cart" },
];
function figmaCanvas(c: C2D, mode: Mode, w = 1) {
  const m = mode === "mask";
  c.globalAlpha = m ? 1 : w;
  if (!m) {
    c.fillStyle = "#f3f4f6";
    c.beginPath();
    c.roundRect(90, 40, 430, 360, 16);
    c.fill();
    c.strokeStyle = "rgba(26,29,34,0.08)";
    c.lineWidth = 1;
    c.stroke();
    // toolbar
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.roundRect(240, 52, 130, 26, 13);
    c.fill();
    for (let k = 0; k < 5; k++) {
      c.fillStyle = k === 1 ? rgba(COBALT, 1) : "rgba(26,29,34,0.35)";
      c.beginPath();
      c.arc(258 + k * 24, 65, 4, 0, Math.PI * 2);
      c.fill();
    }
  }
  FRAMES.forEach((f, idx) => {
    const y = 108, fw = 104, fh = 200;
    if (!m) {
      c.fillStyle = "rgba(26,29,34,0.5)";
      c.font = `500 9px ${SANS}`;
      c.textAlign = "left";
      c.textBaseline = "alphabetic";
      c.fillText(f.label, f.x, y - 6);
      c.fillStyle = "#ffffff";
      c.fillRect(f.x, y, fw, fh);
    }
    c.strokeStyle = m ? "#000" : idx === 1 ? rgba(COBALT, 1) : "rgba(26,29,34,0.14)";
    c.lineWidth = m ? 2.5 : idx === 1 ? 1.6 : 1;
    c.strokeRect(f.x, y, fw, fh);
    const blocks: [number, number, number, number][] = [
      [10, 12, 54, 8],
      [10, 30, 84, 56],
      [10, 98, 84, 22],
      [10, 126, 84, 22],
      [10, 154, 84, 22],
    ];
    for (const [bx, by, bw, bh] of blocks) {
      if (m) {
        c.strokeRect(f.x + bx, y + by, bw, bh);
      } else {
        c.fillStyle = idx === 1 && by === 30 ? rgba(COBALT, 0.85) : "rgba(26,29,34,0.07)";
        c.beginPath();
        c.roundRect(f.x + bx, y + by, bw, bh, 4);
        c.fill();
      }
    }
    if (!m && idx === 1) {
      // auto layout spacing
      c.fillStyle = "rgba(242,72,140,0.85)";
      for (const gy of [120, 148]) c.fillRect(f.x + 10, y + gy, 84, 6);
      // handles + size badge
      c.fillStyle = "#ffffff";
      c.strokeStyle = rgba(COBALT, 1);
      c.lineWidth = 1.2;
      for (const [hx, hy] of [[0, 0], [fw, 0], [0, fh], [fw, fh]]) {
        c.fillRect(f.x + hx - 3, y + hy - 3, 6, 6);
        c.strokeRect(f.x + hx - 3, y + hy - 3, 6, 6);
      }
      c.fillStyle = rgba(COBALT, 1);
      c.beginPath();
      c.roundRect(f.x + fw / 2 - 30, y + fh + 8, 60, 16, 4);
      c.fill();
      c.fillStyle = "#fff";
      c.font = `600 8.5px ${SANS}`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("375 × 812", f.x + fw / 2, y + fh + 16.5);
      // collaborator cursor
      const cx = f.x + fw + 30, cy = y + fh - 30;
      c.fillStyle = rgba(COBALT, 1);
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx, cy + 15);
      c.lineTo(cx + 4, cy + 11);
      c.lineTo(cx + 11, cy + 11);
      c.closePath();
      c.fill();
      c.beginPath();
      c.roundRect(cx + 8, cy + 14, 34, 15, 7.5);
      c.fill();
      c.fillStyle = "#fff";
      c.font = `600 8.5px ${SANS}`;
      c.fillText("Talia", cx + 25, cy + 22);
    }
  });
  c.globalAlpha = 1;
}

// The phone: Talia Alon Bakery's ordering screen.
const PX = 210, PY = 20, PW = 190, PH = 400, PR = 30;
const ROWS = [0, 1].map((i) => [PX + 14, PY + 196 + i * 58, PW - 28, 50] as const);
const BTN = [PX + 18, PY + PH - 62, PW - 36, 38] as const;
function phone(c: C2D, mode: Mode, w = 1, inter = 0) {
  const m = mode === "mask";
  c.globalAlpha = m ? 1 : w;
  c.strokeStyle = m ? "#000" : rgba(INK, 0.9);
  c.lineWidth = m ? 2.5 : 2;
  if (!m) {
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.roundRect(PX, PY, PW, PH, PR);
    c.fill();
  }
  c.beginPath();
  c.roundRect(PX, PY, PW, PH, PR);
  c.stroke();
  if (m) {
    c.strokeRect(PX + 14, PY + 62, PW - 28, 96);
    for (const [x, y, rw, rh] of ROWS) c.strokeRect(x, y, rw, rh);
    c.strokeRect(...BTN);
    c.globalAlpha = 1;
    return;
  }
  const txt = (s: string, x: number, y: number, size: number, weight: number, color: string, align: CanvasTextAlign = "left") => {
    c.font = `${weight} ${size}px ${SANS}`;
    c.textAlign = align;
    c.textBaseline = "middle";
    c.fillStyle = color;
    c.fillText(s, x, y);
  };
  c.fillStyle = rgba(INK, 1);
  c.beginPath();
  c.roundRect(PX + PW / 2 - 30, PY + 10, 60, 16, 8);
  c.fill();
  txt("9:41", PX + 26, PY + 18, 9, 600, rgba(INK, 1));
  txt("Talia Alon", PX + 16, PY + 44, 14, 600, rgba(INK, 1));
  // bag icon + badge
  c.strokeStyle = rgba(INK, 1);
  c.lineWidth = 1.4;
  c.beginPath();
  c.roundRect(PX + PW - 32, PY + 38, 14, 13, 2.5);
  c.stroke();
  const added = inter > 0.55;
  if (added) {
    c.fillStyle = rgba(COBALT, 1);
    c.beginPath();
    c.arc(PX + PW - 17, PY + 37, 5.5, 0, Math.PI * 2);
    c.fill();
    txt("2", PX + PW - 17, PY + 37.5, 7, 700, "#fff", "center");
  }
  // hero
  c.fillStyle = "#f4e6d4";
  c.beginPath();
  c.roundRect(PX + 14, PY + 62, PW - 28, 96, 14);
  c.fill();
  for (const [x, y, r] of [[PX + 62, PY + 112, 20], [PX + 98, PY + 104, 22], [PX + 134, PY + 114, 19]]) {
    c.fillStyle = "#b9773f";
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#f2d5ad";
    c.lineWidth = 2.4;
    c.beginPath();
    for (let a = 0; a < Math.PI * 5; a += 0.2) {
      const rr = (a / (Math.PI * 5)) * (r - 4);
      const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
      if (a === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.stroke();
  }
  txt("Fresh this week", PX + 16, PY + 178, 11, 600, rgba(INK, 1));
  const items: [string, string][] = [
    ["Kinder rolls", "Box of 7, ₪40"],
    ["Nutella rolls", "Box of 7, ₪40"],
  ];
  ROWS.forEach(([x, y, rw, rh], i) => {
    c.fillStyle = "#ffffff";
    c.strokeStyle = rgba(INK, 0.1);
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(x, y, rw, rh, 12);
    c.fill();
    c.stroke();
    c.fillStyle = "#f4e6d4";
    c.beginPath();
    c.roundRect(x + 8, y + 8, 34, 34, 9);
    c.fill();
    c.fillStyle = "#b9773f";
    c.beginPath();
    c.arc(x + 25, y + 25, 9, 0, Math.PI * 2);
    c.fill();
    txt(items[i][0], x + 50, y + 18, 10.5, 600, rgba(INK, 1));
    txt(items[i][1], x + 50, y + 33, 8.5, 400, rgba(INK, 0.5));
    // quantity
    const q = added ? 1 : 0;
    c.fillStyle = q ? rgba(COBALT, 1) : rgba(INK, 0.06);
    c.beginPath();
    c.arc(x + rw - 18, y + 25, 10, 0, Math.PI * 2);
    c.fill();
    txt(q ? "1" : "+", x + rw - 18, y + 25.5, 10, 600, q ? "#fff" : rgba(INK, 0.7), "center");
  });
  // primary action
  const press = Math.sin(Math.PI * seg(inter, 0.6, 0.75));
  const sc = 1 - 0.05 * press;
  const [bx, by, bw, bh] = BTN;
  c.fillStyle = rgba(COBALT, 1);
  c.beginPath();
  c.roundRect(bx + (bw * (1 - sc)) / 2, by + (bh * (1 - sc)) / 2, bw * sc, bh * sc, 19);
  c.fill();
  txt(added ? "Send order · ₪80" : "Send order", bx + bw / 2, by + bh / 2 + 0.5, 10.5, 600, "#fff", "center");
  c.fillStyle = rgba(INK, 0.9);
  c.beginPath();
  c.roundRect(PX + PW / 2 - 34, PY + PH - 12, 68, 3.5, 2);
  c.fill();

  // cursor: taps "+" on both rows, then "Send order"
  if (inter > 0.01) {
    const pts: [number, number][] = [
      [PX + PW + 60, PY + PH - 10],
      [ROWS[0][0] + ROWS[0][2] - 18, ROWS[0][1] + 25],
      [ROWS[1][0] + ROWS[1][2] - 18, ROWS[1][1] + 25],
      [bx + bw * 0.6, by + bh * 0.6],
    ];
    const tt = seg(inter, 0, 0.72) * 3;
    const k = Math.min(2, Math.floor(tt));
    const f = ease(tt - k);
    const cx = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f;
    const cy = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f;
    const curA = Math.min(seg(inter, 0, 0.08), 1 - seg(inter, 0.88, 1));
    c.save();
    c.globalAlpha = w * curA;
    c.translate(cx, cy);
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, 17);
    c.lineTo(4.5, 13);
    c.lineTo(8, 20);
    c.lineTo(10.5, 19);
    c.lineTo(7, 12);
    c.lineTo(12.5, 12);
    c.closePath();
    c.fillStyle = rgba(INK, 1);
    c.fill();
    c.strokeStyle = "#fff";
    c.lineWidth = 1.4;
    c.stroke();
    c.restore();
  }
  // toast
  const ta = easeOut(seg(inter, 0.76, 0.92));
  if (ta > 0) {
    c.save();
    c.globalAlpha = w * ta;
    const ty = PY + 12 - (1 - ta) * 14;
    c.shadowColor = "rgba(26,29,34,0.2)";
    c.shadowBlur = 14;
    c.shadowOffsetY = 4;
    c.fillStyle = rgba(INK, 1);
    c.beginPath();
    c.roundRect(PX + 14, ty, PW - 28, 30, 10);
    c.fill();
    c.shadowColor = "transparent";
    c.fillStyle = "#2f9e5b";
    c.beginPath();
    c.arc(PX + 30, ty + 15, 6, 0, Math.PI * 2);
    c.fill();
    txt("✓", PX + 30, ty + 15.5, 7, 700, "#fff", "center");
    txt("Order sent to Talia", PX + 42, ty + 15, 9.5, 500, "#fff");
    c.restore();
  }
  c.globalAlpha = 1;
}

const SHAPES = [null, chalkboard, stickyNotes, figmaCanvas, phone] as const;
const SHAPE_COLOR: RGB[] = [COBALT, CHALK, INK, COBALT, INK];
type Transition = "pour" | "burst" | "snap" | "fold";
const TRANSITIONS: Transition[] = ["pour", "burst", "snap", "fold"];

/** Sample N points on a shape's strokes, ordered left to right. */
function sampleShape(draw: (c: C2D, m: Mode) => void): [number, number][] {
  const S = 2;
  const cv = document.createElement("canvas");
  cv.width = 610 * S;
  cv.height = 440 * S;
  const c = cv.getContext("2d", { willReadFrequently: true })!;
  c.scale(S, S);
  draw(c, "mask");
  const data = c.getImageData(0, 0, cv.width, cv.height).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < cv.height; y += 3) {
    for (let x = 0; x < cv.width; x += 3) {
      if (data[(y * cv.width + x) * 4 + 3] > 120) pts.push([x / S, y / S]);
    }
  }
  // deterministic shuffle, then take N spread evenly
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(rand(i, 12.9898) * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  const out: [number, number][] = [];
  for (let i = 0; i < N; i++) out.push(pts.length ? pts[i % pts.length] : [BCX, BCY]);
  return out.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

// Particles keep their left-to-right order through every shape.
const byX = nodes.map((_, i) => i).sort((a, b) => nodes[a].x - nodes[b].x);
const rankOf = new Array<number>(N);
byX.forEach((idx, r) => (rankOf[idx] = r));

/* ---------- component ------------------------------------------------ */

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    SANS = getComputedStyle(canvas).fontFamily || SANS;

    // targets[shape][particle]
    let targets: [number, number][][] = [];
    const buildTargets = () => {
      targets = SHAPES.map((fn) => {
        if (!fn) return [];
        const pts = sampleShape((c, m) => fn(c, m));
        return nodes.map((_, i) => pts[rankOf[i]]);
      });
    };
    buildTargets();
    document.fonts?.ready.then(buildTargets);

    const intensity = Object.fromEntries(REGIONS.map((r) => [r, 0])) as Record<Region, number>;
    const nodeK = new Float32Array(N);
    const pulses: { e: number; t: number; v: number }[] = [];
    let t = 0;
    let form = 0;
    let turn = 0;
    let lastIdx = -2;
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
      const k = reduce ? 1 : 1 - Math.exp(-dt * 8);
      const els = stepRefs.current;
      const sec = canvas.closest("section")?.getBoundingClientRect();
      if (!sec || els.some((e) => !e)) {
        if (running) frame = requestAnimationFrame(tick);
        return;
      }
      const rects = els.map((e) => e!.getBoundingClientRect());
      const centers = rects.map((r, i) => (i === rects.length - 1 ? r.top + vh * 0.3 : r.top + r.height / 2));
      const mid = vh * 0.5;

      // continuous position along the timeline: 0 = first step centred, 5 = last
      let tt = 0;
      if (centers[0] > mid) tt = 0;
      else if (centers[centers.length - 1] <= mid) tt = centers.length - 1;
      else {
        for (let i = 0; i < centers.length - 1; i++) {
          if (centers[i] <= mid && centers[i + 1] > mid) {
            tt = i + (mid - centers[i]) / (centers[i + 1] - centers[i]);
            break;
          }
        }
      }
      t += (tt - t) * k;
      form += (clamp((vh * 0.95 - sec.top) / (vh * 0.75)) - form) * k;
      turn += (clamp((vh - centers[0]) / vh) - turn) * k;

      const idx = Math.min(steps.length - 1, Math.round(t));
      const visibleIdx = centers[0] > vh * 0.75 ? -1 : idx;
      if (visibleIdx !== lastIdx) {
        lastIdx = visibleIdx;
        setActive(visibleIdx);
      }

      // brain lights region by region as the first step scrolls in
      const light = clamp((vh * 0.95 - centers[0]) / (vh * 0.45));
      for (const r of REGIONS) {
        const goal = smooth(seg(light, LIGHT_AT[r], LIGHT_AT[r] + 0.3));
        intensity[r] += (goal - intensity[r]) * k;
      }
      for (let i = 0; i < N; i++) {
        const goal = smooth(clamp((intensity[nodes[i].r] * 300 - nodeDist[i]) / 70));
        nodeK[i] += (goal - nodeK[i]) * k;
      }
      if (!reduce && t < 1 && pulses.length < 30 && Math.random() < 0.4) {
        const e = Math.floor(Math.random() * edges.length);
        const [a, b] = edges[e];
        if (nodeK[a] > 0.4 || nodeK[b] > 0.4) pulses.push({ e, t: 0, v: 0.8 + Math.random() * 1.2 });
      }

      draw(now, dt);
      if (running) frame = requestAnimationFrame(tick);
    };

    const draw = (now: number, dt: number) => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);
      if (!targets.length) return;
      const s = Math.min(w / 610, h / 440);
      const ox = (w - 610 * s) / 2;
      const oy = (h - 440 * s) / 2;
      const X = (x: number) => ox + x * s;
      const Y = (y: number) => oy + y * s;
      const art = (fn: (c: C2D) => void) => {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.scale(s, s);
        fn(ctx);
        ctx.restore();
      };

      // which shapes are we between?
      const last = SHAPES.length - 1;
      const a = Math.min(last, Math.floor(t));
      const f = t - a;
      const m = a >= last ? 0 : smooth(seg(f, 0.15, 0.85));
      const inter = a >= last ? seg(t, last, last + 0.85) : 0;
      const b = Math.min(last, a + 1);
      const type = TRANSITIONS[Math.min(a, TRANSITIONS.length - 1)];
      const wSrc = 1 - smooth(clamp(m * 2.4));
      const wDst = smooth(clamp(m * 2 - 1));

      /* positions */
      const time = now / 1000;
      const th = (turn - 0.5) * 0.9;
      const cosT = Math.cos(th), sinT = Math.sin(th);
      const brainAt = (i: number): [number, number] => {
        const n = nodes[i];
        const drift = reduce ? 0 : 1.2;
        let x = BCX + (n.x - BCX) * cosT + depthZ[i] * sinT + Math.sin(time * 0.7 + i * 1.7) * drift;
        let y = n.y + Math.cos(time * 0.6 + i * 2.3) * drift;
        const ff = ease(clamp(form * 1.6 - (1 - rankOf[i] / N) * 0.6));
        x = dust[i][0] + (x - dust[i][0]) * ff;
        y = dust[i][1] + (y - dust[i][1]) * ff;
        return [x, y];
      };
      const at = (shape: number, i: number): [number, number] => (shape === 0 ? brainAt(i) : targets[shape][i]);

      const pos: [number, number][] = new Array(N);
      const prog = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const p0 = at(a, i);
        if (m <= 0) {
          pos[i] = p0;
          continue;
        }
        const p3 = at(b, i);
        let st: number;
        if (type === "pour") st = (p3[0] - 118) / 374;
        else if (type === "burst") st = rand(i, 4.1);
        else if (type === "snap") st = (p3[1] - 40) / 360;
        else st = Math.hypot(p3[0] - 305, p3[1] - 220) / 260;
        const q = clamp(m * 1.7 - clamp(st) * 0.7);
        prog[i] = q;
        let p1: [number, number], p2: [number, number], e: number;
        if (type === "pour") {
          // drip down, then get drawn on from above, left to right
          p1 = [p0[0] + (rand(i, 9.7) - 0.5) * 20, Math.max(p0[1], p3[1]) + 120 + rand(i, 2.2) * 60];
          p2 = [p3[0] - 30, p3[1] - 50];
          e = ease(q);
        } else if (type === "burst") {
          const dx = p0[0] - 305, dy = p0[1] - 190;
          p1 = [p0[0] + dx * 0.9 + (rand(i, 5.5) - 0.5) * 120, p0[1] + dy * 0.9 + (rand(i, 6.6) - 0.5) * 120];
          p2 = [p3[0] + (rand(i, 7.7) - 0.5) * 60, p3[1] - 40];
          e = ease(q);
        } else if (type === "snap") {
          p1 = [p0[0], p0[1]];
          p2 = [p3[0], p3[1]];
          e = backOut(q);
        } else {
          // fold inward on a spiral
          const cx = 305, cy = 220;
          p1 = [cx - (p0[1] - cy) * 0.8, cy + (p0[0] - cx) * 0.5];
          p2 = [cx + (p3[1] - cy) * 0.6, cy - (p3[0] - cx) * 0.3];
          e = ease(q);
        }
        pos[i] = [bez(p0[0], p1[0], p2[0], p3[0], e), bez(p0[1], p1[1], p2[1], p3[1], e)];
      }

      /* solid artwork under the particles */
      if (a > 0 && wSrc > 0.01) art((c) => SHAPES[a]!(c, "render", wSrc, inter));
      if (b > 0 && b !== a && wDst > 0.01) art((c) => SHAPES[b]!(c, "render", wDst, 0));

      /* brain outline + connections */
      if (a === 0) {
        const outA = (1 - smooth(clamp(m * 3))) * ease(clamp(form * 1.4 - 0.4));
        if (outA > 0.01) {
          ctx.save();
          ctx.globalAlpha = outA;
          ctx.strokeStyle = rgba(INK, 0.2);
          ctx.lineWidth = 1.4;
          const OX = (x: number) => X(BCX + (x - BCX) * cosT);
          ctx.beginPath();
          for (let i = 0; i <= outline.length; i++) {
            const p0 = outline[i % outline.length];
            const p1 = outline[(i + 1) % outline.length];
            const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
            if (i === 0) ctx.moveTo(OX(mx), Y(my));
            else ctx.quadraticCurveTo(OX(p0[0]), Y(p0[1]), OX(mx), Y(my));
          }
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(OX(452), Y(330), 72 * s * Math.abs(cosT), 40 * s, 0, 0.15 * Math.PI, 1.05 * Math.PI);
          ctx.moveTo(OX(378), Y(318));
          ctx.lineTo(OX(384), Y(410));
          ctx.moveTo(OX(410), Y(312));
          ctx.lineTo(OX(420), Y(410));
          ctx.stroke();
          ctx.restore();
        }
        // connections stretch like threads of liquid, then snap
        ctx.save();
        for (const [ea, eb] of edges) {
          const stretch = Math.max(prog[ea], prog[eb]);
          const al = form * form * (1 - smooth(clamp(stretch * 2.5)));
          if (al < 0.01) continue;
          const kk = Math.min(nodeK[ea], nodeK[eb]);
          ctx.strokeStyle = rgba(mix(INK, COBALT, kk), (0.1 + kk * 0.42) * al);
          ctx.lineWidth = 1 + kk * 0.5;
          ctx.beginPath();
          ctx.moveTo(X(pos[ea][0]), Y(pos[ea][1]));
          ctx.lineTo(X(pos[eb][0]), Y(pos[eb][1]));
          ctx.stroke();
        }
        if (m < 0.2) {
          for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            p.t += p.v * dt;
            if (p.t >= 1) {
              pulses.splice(i, 1);
              continue;
            }
            const [pa, pb] = edges[p.e];
            const x = X(pos[pa][0] + (pos[pb][0] - pos[pa][0]) * p.t);
            const y = Y(pos[pa][1] + (pos[pb][1] - pos[pa][1]) * p.t);
            const fade = Math.sin(p.t * Math.PI) * (1 - m * 5);
            ctx.fillStyle = rgba(COBALT, 0.25 * fade);
            ctx.beginPath();
            ctx.arc(x, y, 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = rgba(COBALT, 0.95 * fade);
            ctx.beginPath();
            ctx.arc(x, y, 2.1, 0, Math.PI * 2);
            ctx.fill();
          }
        } else pulses.length = 0;
        ctx.restore();
      }

      /* particles */
      const settled = (a > 0 ? wSrc : 0) + (b > 0 ? wDst : 0);
      const partA = 1 - 0.82 * clamp(settled);
      if (partA > 0.01) {
        // chalk-white only reads once the board is behind it
        const colorAt = (shape: number, wBoard: number) => (shape === 1 ? mix(INK, CHALK, wBoard) : SHAPE_COLOR[shape]);
        const cA = colorAt(a, a === 1 ? wSrc : 1), cB = colorAt(b, b === 1 ? wDst : 1);
        for (let i = 0; i < N; i++) {
          const q = prog[i];
          let col = mix(cA, cB, q);
          let kk = 0;
          if (a === 0) {
            kk = nodeK[i] * (1 - q);
            col = mix(mix(INK, COBALT, kk), cB, q);
          }
          const x = X(pos[i][0]), y = Y(pos[i][1]);
          const r = (2.3 + kk * 1.5) * Math.max(0.8, s) * (1 - Math.sin(q * Math.PI) * 0.25);
          if (kk > 0.05) {
            ctx.fillStyle = rgba(COBALT, 0.11 * kk * partA);
            ctx.beginPath();
            ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = rgba(col, (0.45 + kk * 0.5 + (a > 0 || q > 0 ? 0.35 : 0)) * partA * (0.35 + 0.65 * form));
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
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

  const caption = active >= 0 ? steps[active].regionLabel : "Scroll through my background";

  return (
    <section id="about" className="scroll-mt-16 border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8 sm:pt-28">
        <h2 className="text-[40px] leading-none font-semibold tracking-[-0.03em] text-graphite sm:text-[56px]">Background</h2>
        <p className="mt-4 max-w-[60ch] text-lg leading-[1.6] text-graphite-soft">
          I came to design through cognitive science and teaching. Keep scrolling and watch one idea turn into the next.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-x-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="sticky top-16 z-10 -mx-5 border-b border-rule bg-white/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-24 lg:mx-0 lg:h-[calc(100vh-8rem)] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="flex h-[32vh] flex-col lg:h-full lg:justify-center">
            <canvas ref={canvasRef} aria-hidden className="h-full w-full font-sans lg:h-[80%]" />
            <p className="mt-2 text-center text-[15px] text-graphite-soft lg:mt-6" aria-live="polite">
              {caption}
            </p>
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
                  isLast ? "min-h-[110vh] py-12 lg:min-h-[120vh] lg:py-16" : "flex flex-col justify-center py-12 lg:min-h-[78vh] lg:py-16"
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
