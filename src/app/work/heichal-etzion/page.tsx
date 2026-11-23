import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import Kicker from "@/components/Kicker";
import ProblemDecision from "@/components/case-study/ProblemDecision";

export const metadata: Metadata = {
  title: "Heichal Etzion | Talia Alon",
  description:
    "A donation landing page for a synagogue's renovation campaign, built for a real community.",
};

export default function HeichalEtzionPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Solo · Real-Client Donation Landing Page"
          title="Heichal Etzion"
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <MockupCover
            src="/images/work/heichal-etzion-cover.webp"
            alt="A phone in hand showing the Heichal Etzion donation page"
            priority
            fit="cover"
          />

          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 border-y border-border py-6 text-sm sm:grid-cols-2">
            <div className="flex gap-2"><dt className="font-semibold text-ink">Client:</dt><dd className="text-ink-secondary">Heichal Etzion synagogue, Hadera</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Role:</dt><dd className="text-ink-secondary">UX/UI design, solo</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Platform:</dt><dd className="text-ink-secondary">Mobile-first web, Hebrew (RTL)</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Tool:</dt><dd className="text-ink-secondary">Figma</dd></div>
          </dl>

          <section>
            <Kicker>The brief</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              The synagogue needed a renovation: the ceiling and electrics, new
              benches and chairs, and restoring the ark. The campaign needed one
              page that explains why, and makes giving as easy as possible.
            </p>
          </section>

          <section>
            <Kicker>Key decisions</Kicker>
            <div className="space-y-4">
              <ProblemDecision
                title="Two ways to give, one recommended"
                problem="Too many payment options slow people down at the moment they decide to give."
                decision="Only two methods: Paybox, marked “recommended, fast and secure”, and a bank transfer for people who prefer it or want a monthly standing order."
              />
              <ProblemDecision
                title="Tax credit up front"
                problem="For many donors, a tax-deductible receipt is part of the decision."
                decision="Section 46 recognition appears in the header, in the donation section and in the footer, together with the registered nonprofit number."
              />
              <ProblemDecision
                title="Closing the loop after a bank transfer"
                problem="A bank transfer happens outside the site, so the synagogue can't tell who gave or send a receipt."
                decision="Right under the bank details, one button to report the transfer and receive an official receipt."
              />
              <ProblemDecision
                title="A person for the personal cases"
                problem="Many donations are dedications, in memory of someone or for a family event, which a form can't handle well."
                decision="A separate card sends people to WhatsApp, to speak with the team directly."
              />
            </div>
          </section>

          <section>
            <Kicker>The page, section by section</Kicker>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { src: "/images/work/heichal/hero.webp", h: 1242, alt: "Hero: a photo of the synagogue interior with the campaign headline and a Donate now button", c: "Hero: the campaign and one button" },
                { src: "/images/work/heichal/about.webp", h: 986, alt: "About: fifty years of prayer, and what the renovation covers", c: "Why: fifty years, and what needs fixing" },
                { src: "/images/work/heichal/donate.webp", h: 2591, alt: "Donation section: Paybox card and bank transfer details with a receipt button", c: "Give: Paybox or bank transfer" },
                { src: "/images/work/heichal/support.webp", h: 925, alt: "Support card: dedications and questions via WhatsApp", c: "Talk to us: dedications on WhatsApp" },
              ].map((s) => (
                <figure key={s.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} width={780} height={s.h} loading="lazy" className="block h-auto w-full rounded-[10px] ring-1 ring-rule" />
                  <figcaption className="mt-3 text-[15px] leading-[1.5] text-graphite-soft">{s.c}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section>
            <Kicker>Try the prototype</Kicker>
            <FigmaEmbed
              fileKey="UGGXC78wiz9N0wYEXXsfWP"
              fileName="Heichal Etzion"
              nodeId="1:452"
              title="Heichal Etzion live prototype"
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
