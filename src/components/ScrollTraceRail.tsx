"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const waypoints = [0, 0.25, 0.5, 0.75, 0.98];

export default function ScrollTraceRail() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="pointer-events-none fixed top-0 bottom-0 left-6 z-40 hidden w-px lg:block xl:left-10">
      <div className="absolute inset-0 bg-brass/20" />
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top bg-brass"
        style={{ scaleY: scrollYProgress }}
      />
      {waypoints.map((wp) => (
        <RailDot key={wp} at={wp} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function RailDot({
  at,
  progress,
}: {
  at: number;
  progress: MotionValue<number>;
}) {
  const scale = useTransform(progress, [Math.max(0, at - 0.03), at], [0.6, 1.15]);
  const background = useTransform(progress, (p) =>
    p >= at ? "var(--color-brass)" : "var(--color-brand-ink)"
  );

  return (
    <motion.span
      className="absolute -left-[3.5px] h-2 w-2 rounded-full border border-brass"
      style={{ top: `${at * 100}%`, scale, backgroundColor: background }}
    />
  );
}
