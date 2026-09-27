"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const nodes: Array<[number, number, number]> = [
  [12, 190, 6],
  [90, 140, 6],
  [150, 165, 6],
  [215, 95, 6],
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
        viewBox="0 0 320 220"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          d="M12 190 L90 140 L150 165 L215 95 L300 30"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
        />
        {nodes.map(([cx, cy, r], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="origin-center [transform-box:fill-box]"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.25 + i * 0.32,
              duration: 0.35,
              ease: "easeOut",
            }}
          />
        ))}
        <motion.circle
          cx={300}
          cy={30}
          r={10}
          fill="currentColor"
          className="origin-center [transform-box:fill-box]"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: [0.3, 1.3, 1] }}
          transition={{ delay: 1.55, duration: 0.5, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}
