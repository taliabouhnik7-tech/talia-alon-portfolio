import Link from "next/link";
import Logo from "@/components/Logo";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule/70 bg-white/75 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-[-0.01em] text-graphite">
          <Logo className="h-5 w-auto text-graphite" />
          Talia Alon
        </Link>
        <ul className="flex items-center gap-6 text-[15px] text-graphite-soft sm:gap-8">
          <li>
            <Link href="/#work" className="transition-colors hover:text-graphite">
              Work
            </Link>
          </li>
          <li>
            <Link href="/#about" className="transition-colors hover:text-graphite">
              About
            </Link>
          </li>
          <li>
            <Link href="/#contact" className="transition-colors hover:text-graphite">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
