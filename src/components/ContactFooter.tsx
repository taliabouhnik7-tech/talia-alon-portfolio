const links = [
  { label: "Email", value: "taliabouhnik7@gmail.com", href: "mailto:taliabouhnik7@gmail.com" },
  { label: "Phone", value: "058-666-6623", href: "tel:+972586666623" },
  { label: "LinkedIn", value: "View profile", href: "https://www.linkedin.com/in/talia-bouhnik-091196412", external: true },
  { label: "Behance", value: "behance.net/5dec536b", href: "https://www.behance.net/5dec536b", external: true },
  { label: "CV", value: "Download PDF", href: "/cv/Talia_Alon_CV.pdf", external: true },
];

export default function ContactFooter() {
  return (
    <footer id="contact" className="scroll-mt-16 border-t border-rule bg-canvas">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-[28px] font-semibold tracking-[-0.025em] text-graphite">Contact</h2>
            <p className="mt-2 max-w-[36ch] text-[17px] leading-[1.55] text-graphite-soft">
              Hiring for a UX/UI role? I&apos;d be happy to talk.
            </p>
          </div>
          <dl className="grid gap-6 sm:grid-cols-[1.5fr_1fr_1fr]">
            {links.map((l) => (
              <div key={l.label}>
                <dt className="text-[15px] text-graphite-soft">{l.label}</dt>
                <dd className="mt-1">
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-[17px] font-medium [overflow-wrap:anywhere] text-graphite underline decoration-graphite/20 underline-offset-4 hover:decoration-select"
                  >
                    {l.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-14 text-[14px] text-graphite-soft">© {new Date().getFullYear()} Talia Alon, Hadera, Israel</p>
      </div>
    </footer>
  );
}
