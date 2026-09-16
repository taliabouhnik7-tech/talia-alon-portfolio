import Kicker from "@/components/Kicker";

export default function ContactFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Kicker>Contact</Kicker>
        <h2 className="max-w-xl font-serif text-3xl text-ink sm:text-4xl">
          Open to UX/UI roles — let&apos;s talk about how I could help your
          team.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <ul className="space-y-3 text-base text-ink-secondary sm:text-lg">
            <li>
              <a
                href="mailto:taliabouhnik7@gmail.com"
                className="font-medium text-ink transition-colors hover:text-accent"
              >
                taliabouhnik7@gmail.com
              </a>
            </li>
            <li>
              <a
                href="tel:+972586666623"
                className="font-medium text-ink transition-colors hover:text-accent"
              >
                058-666-6623
              </a>
            </li>
            <li>Hadera, Israel</li>
            <li>
              <a
                href="https://www.behance.net/5dec536b"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink transition-colors hover:text-accent"
              >
                Behance ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 text-xs text-ink-secondary sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-base text-ink">Talia Alon</p>
          <p>© {new Date().getFullYear()} Talia Alon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
