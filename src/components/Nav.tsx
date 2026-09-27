"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b"
      animate={{
        backgroundColor: scrolled
          ? "var(--color-brand)"
          : "var(--color-brand-deep)",
        borderColor: scrolled ? "rgba(185,166,255,0.15)" : "rgba(0,0,0,0)",
        backdropFilter: scrolled ? "blur(8px)" : "blur(0px)",
      }}
      transition={{ duration: 0.3 }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-brand-ink">
          <Logo className="h-6 w-auto text-brand-glow" />
          <span className="font-serif text-lg font-medium tracking-tight sm:text-xl">
            Talia Alon
          </span>
        </Link>
        <ul className="flex items-center gap-5 text-sm font-medium text-brand-ink sm:gap-8">
          <li>
            <Link href="/#work" className="transition-colors hover:text-brand-glow">
              Work
            </Link>
          </li>
          <li>
            <Link href="/#about" className="transition-colors hover:text-brand-glow">
              About
            </Link>
          </li>
          <li>
            <Link href="/#contact" className="transition-colors hover:text-brand-glow">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
