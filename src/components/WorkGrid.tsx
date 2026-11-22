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
import Kicker from "@/components/Kicker";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";

const heading = (
  <>
    <Kicker>Selected Work</Kicker>
    <h2 className="max-w-2xl font-serif text-3xl text-ink sm:text-4xl">
      Eight projects, from a live product I run end to end to team case
      studies in enterprise, edtech, and e-commerce.
    </h2>
  </>
);

export default function WorkGrid() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="relative">
      {/* Mobile / tablet / reduced motion: the classic grid */}
      <div className={`mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 ${reduce ? "" : "lg:hidden"}`}>
        <Reveal>
          <div className="mb-10">{heading}</div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Desktop: vertical scroll drives a horizontal pass through the work */}
      {!reduce && <HorizontalTrack />}
    </section>
  );
}

function HorizontalTrack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35 });
  const x = useTransform(p, [0, 1], [0, -distance]);

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        <div className="mx-auto mb-10 flex w-full max-w-6xl items-end justify-between gap-10 px-8">
          <div>{heading}</div>
          <Counter p={p} />
        </div>

        <motion.div
          ref={trackRef}
          className="flex w-max gap-7 pl-[max(2rem,calc((100vw-72rem)/2+2rem))] pr-[10vw]"
          style={{ x }}
        >
          {projects.map((project, i) => (
            <TiltCard key={project.slug} index={i} p={p}>
              <ProjectCard project={project} />
            </TiltCard>
          ))}
        </motion.div>

        <div className="mx-auto mt-10 h-px w-full max-w-6xl bg-ink/10 px-8">
          <motion.div className="h-px origin-left bg-brass" style={{ scaleX: p }} />
        </div>
      </div>
    </div>
  );
}

/** Each card eases in from a slight 3D turn as it travels into view. */
function TiltCard({
  index,
  p,
  children,
}: {
  index: number;
  p: MotionValue<number>;
  children: React.ReactNode;
}) {
  const n = projects.length;
  const center = index / (n - 1);
  const rotateY = useTransform(p, [center - 0.45, center, center + 0.45], [-14, 0, 8]);
  const opacity = useTransform(p, [center - 0.6, center - 0.25], [0.35, 1]);
  return (
    <motion.div
      className="w-[380px] shrink-0 xl:w-[420px]"
      style={{ rotateY, opacity, transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ p }: { p: MotionValue<number> }) {
  const n = projects.length;
  const current = useTransform(p, (v) =>
    String(Math.min(n, Math.round(v * (n - 1)) + 1)).padStart(2, "0")
  );
  return (
    <p className="shrink-0 pb-1 font-serif text-ink">
      <motion.span className="text-5xl text-brass">{current}</motion.span>
      <span className="text-xl text-ink-secondary"> / {String(n).padStart(2, "0")}</span>
    </p>
  );
}
