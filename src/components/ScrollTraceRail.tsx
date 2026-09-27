"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export default function ScrollTraceRail() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const [marks, setMarks] = useState<number[]>([]);

  useEffect(() => {
    const compute = () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("main section, main > footer, footer")
      );
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0 || nodes.length === 0) {
        setMarks([]);
        return;
      }
      const fractions = nodes
        .map((el) => el.offsetTop / docHeight)
        .filter((f) => f >= 0 && f <= 1);
      setMarks(fractions);
    };

    compute();
    const t1 = setTimeout(compute, 300);
    const t2 = setTimeout(compute, 1000);
    window.addEventListener("resize", compute);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", compute);
    };
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed top-0 bottom-0 left-6 z-40 hidden w-px lg:block xl:left-10">
      <div className="absolute inset-0 bg-brass/20" />
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top bg-brass"
        style={{ scaleY: scrollYProgress }}
      />
      {marks.map((m, i) => (
        <RailDot key={`${pathname}-${i}-${m.toFixed(3)}`} at={m} progress={scrollYProgress} />
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
  const scale = useTransform(progress, [Math.max(0, at - 0.02), at], [0.6, 1.15]);
  const background = useTransform(progress, (p) =>
    p >= at ? "var(--color-brass)" : "var(--color-card)"
  );

  return (
    <motion.span
      className="absolute -left-[3.5px] h-2 w-2 rounded-full border border-brass"
      style={{ top: `${at * 100}%`, scale, backgroundColor: background }}
    />
  );
}
