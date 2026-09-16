import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import BrowserChromeFrame from "@/components/case-study/BrowserChromeFrame";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import PersonaCard from "@/components/case-study/PersonaCard";
import ProblemDecision from "@/components/case-study/ProblemDecision";
import TradeOff from "@/components/case-study/TradeOff";
import PullQuote from "@/components/case-study/PullQuote";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "Y — Math Learning Platform | Talia Alon",
  description:
    "End-to-end design for an online math course platform — information architecture, user flows, catalogue, and full brand identity.",
};

export default function YPlatformPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Solo · EdTech · UX/UI + Branding"
          title="Y — Math Learning Platform"
          tagline={`"הופכים את המתמטיקה לפשוטה ושמים סוף לתסכול" — making math simple and ending the frustration.`}
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <MockupCover
            src="/images/work/y-platform-cover.png"
            alt="Y math learning platform shown on a laptop mockup"
            priority
          />

          <section>
            <Kicker>Persona</Kicker>
            <PersonaCard
              name="Neta"
              meta="12th grade · 3 math units · lower economic background"
              description="Neta arrives anxious, has low patience for friction, and needs control over her own pace."
            />
          </section>

          <section className="space-y-5">
            <Kicker>Problems &amp; decisions</Kicker>
            <ProblemDecision
              title="1. Price"
              problem="Quality math help was historically available mainly to those who could pay for private tutoring."
              decision="Priced a full course at ₪49 versus ₪150/hour for private tutoring, making quality instruction accessible regardless of budget."
            />
            <ProblemDecision
              title="2. Pace"
              problem="One-size-fits-all teaching doesn't fit every student."
              decision="Gave the student full control over pace — repeat a lesson four times or skip ahead, full 24/7 access to all material."
            />
          </section>

          <section className="space-y-5">
            <Kicker>Design decisions</Kicker>
            <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
              <h3 className="mb-3 font-serif text-xl text-ink sm:text-2xl">
                Trust before action
              </h3>
              <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
                The homepage deliberately establishes security and trust
                before asking for any action, because an anxious user needs
                to feel safe before she&apos;ll commit.
              </p>
            </div>
            <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
              <h3 className="mb-3 font-serif text-xl text-ink sm:text-2xl">
                Fewer, calmer steps
              </h3>
              <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
                User research surfaced that Neta&apos;s impatience meant
                &quot;three light steps beat one confusing step&quot; —
                flows were broken into smaller, calmer stages rather than
                dense single screens.
              </p>
            </div>
          </section>

          <section>
            <Kicker>A real design tension</Kicker>
            <TradeOff
              tension={`The team considered a daily streak mechanic for motivation, then flagged it explicitly as a risk: "a streak mechanism can create motivation — but also pressure and guilt. For an anxious user, it could drive her away."`}
              resolution="Recognition without punishment — the system quietly remembers where she left off, instead of showing a 'broken streak.'"
            />
          </section>

          <section>
            <Kicker>Why</Kicker>
            <PullQuote>
              Every decision traced back to one source — who Neta is, and
              what she needs right now.
            </PullQuote>
          </section>

          <section>
            <Kicker>Interface</Kicker>
            <BrowserChromeFrame
              src="/images/work/y-platform.png"
              alt="Y math learning platform course screen"
            />
          </section>

          <section>
            <FigmaEmbed
              fileKey="xHbznNo7CmxfWADbqJk9bo"
              fileName="Y - Math Learning Platform"
              nodeId="1:2"
              title="Y live prototype"
            />
          </section>

          <section>
            <Kicker>Presentation</Kicker>
            <FigmaEmbed
              fileKey="xHbznNo7CmxfWADbqJk9bo"
              fileName="Y - Math Learning Platform"
              nodeId="583:2062"
              title="Y brand book & presentation deck"
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
