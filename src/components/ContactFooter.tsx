export default function ContactFooter() {
  return (
    <footer id="contact" className="scroll-mt-16 bg-graphite text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-[17px] text-white/60">Hiring for a UX/UI role? I&apos;d like to hear about it.</p>
        <a
          href="mailto:taliabouhnik7@gmail.com"
          className="mt-4 inline-block break-all text-[32px] font-semibold leading-tight tracking-[-0.03em] underline decoration-white/25 decoration-2 underline-offset-[10px] transition-colors hover:decoration-white sm:text-[56px] lg:text-[72px]"
        >
          taliabouhnik7@gmail.com
        </a>

        <dl className="mt-16 grid gap-8 border-t border-white/15 pt-6 text-[17px] sm:grid-cols-3">
          <div>
            <dt className="text-white/50">Phone</dt>
            <dd className="mt-1">
              <a href="tel:+972586666623" className="hover:underline">058-666-6623</a>
            </dd>
          </div>
          <div>
            <dt className="text-white/50">Portfolio on Behance</dt>
            <dd className="mt-1">
              <a href="https://www.behance.net/5dec536b" target="_blank" rel="noopener noreferrer" className="hover:underline">
                behance.net/5dec536b
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-white/50">Based in</dt>
            <dd className="mt-1">Hadera, Israel</dd>
          </div>
        </dl>

        <p className="mt-16 text-[15px] text-white/40">© {new Date().getFullYear()} Talia Alon</p>
      </div>
    </footer>
  );
}
