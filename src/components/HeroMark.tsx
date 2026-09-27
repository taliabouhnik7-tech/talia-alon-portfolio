"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const discardedEdges = [
  { d: "M20 205 L95 235", delay: 0.05 },
  { d: "M95 165 L170 195", delay: 0.15 },
  { d: "M170 120 L245 150", delay: 0.25 },
];

const discardedNodes = [
  { cx: 95, cy: 235, delay: 0.35 },
  { cx: 170, cy: 195, delay: 0.45 },
  { cx: 245, cy: 150, delay: 0.55 },
];

const chosenEdges = [
  { d: "M20 205 L95 165", delay: 0.7 },
  { d: "M95 165 L170 120", delay: 1.0 },
  { d: "M170 120 L315 45", delay: 1.3 },
];

const chosenNodes = [
  { cx: 20, cy: 205, delay: 0.65 },
  { cx: 95, cy: 165, delay: 0.95 },
  { cx: 170, cy: 120, delay: 1.25 },
];

export default function HeroMark({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.12]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);

  return (
    <motion.div ref={ref} style={{ y, opacity, scale }} className={className}>
      <svg
        viewBox="0 0 340 240"
        className="h-full w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="hero-mark-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Paths considered and set aside */}
        {discardedEdges.map((edge) => (
          <motion.path
            key={edge.d}
            d={edge.d}
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: edge.delay, ease: "easeOut" }}
          />
        ))}
        {discardedNodes.map((n) => (
          <motion.circle
            key={`${n.cx}-${n.cy}`}
            cx={n.cx}
            cy={n.cy}
            r="3.5"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="1.5"
            className="origin-center [transform-box:fill-box]"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: n.delay }}
          />
        ))}

        {/* The traced decision — glow layer, then crisp layer on top */}
        <g filter="url(#hero-mark-glow)" opacity="0.6">
          {chosenEdges.map((edge) => (
            <motion.path
              key={`glow-${edge.d}`}
              d={edge.d}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.45,
                delay: edge.delay,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
          ))}
        </g>
        {chosenEdges.map((edge) => (
          <motion.path
            key={edge.d}
            d={edge.d}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.45,
              delay: edge.delay,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        ))}
        {chosenNodes.map((n) => (
          <motion.circle
            key={`${n.cx}-${n.cy}`}
            cx={n.cx}
            cy={n.cy}
            r="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="origin-center [transform-box:fill-box]"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: n.delay, ease: "easeOut" }}
          />
        ))}

        <motion.circle
          cx={315}
          cy={45}
          r={11}
          fill="currentColor"
          filter="url(#hero-mark-glow)"
          className="origin-center [transform-box:fill-box]"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: [0.3, 1.35, 1] }}
          transition={{ delay: 1.75, duration: 0.55, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}
