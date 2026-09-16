import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="font-serif text-lg font-medium tracking-tight text-ink sm:text-xl"
        >
          Talia Alon
        </Link>
        <ul className="flex items-center gap-5 text-sm font-medium text-ink sm:gap-8">
          <li>
            <Link href="/#work" className="transition-colors hover:text-accent">
              Work
            </Link>
          </li>
          <li>
            <Link href="/#about" className="transition-colors hover:text-accent">
              About
            </Link>
          </li>
          <li>
            <Link href="/#contact" className="transition-colors hover:text-accent">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
