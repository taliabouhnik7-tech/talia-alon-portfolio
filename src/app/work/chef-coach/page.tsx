import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import BrowserChromeFrame from "@/components/case-study/BrowserChromeFrame";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "Chef Coach | Talia Alon",
  description:
    "A culinary training dashboard built around an AI coach — skill tracking, personalized recommendations, and community support for kitchen professionals.",
};

export default function ChefCoachPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Solo · AI Coaching Platform"
          title="Chef Coach"
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <BrowserChromeFrame
            src="/images/work/chef-coach.png"
            alt="Chef Coach dashboard"
            priority
          />

          <section>
            <Kicker>About this project</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              A culinary training dashboard built around an AI coach —
              skill tracking, personalized recommendations, and community
              support for kitchen professionals. This project doesn&apos;t
              have a full research deck attached in Figma yet, so this
              write-up stays intentionally brief. The file does include
              detailed behavior annotations and a design-tokens
              documentation frame, so a few concrete facts from those are
              below.
            </p>
          </section>

          <section>
            <Kicker>Design system, from the file&apos;s own documentation</Kicker>
            <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
              <ul className="space-y-3 text-sm leading-relaxed text-ink-secondary sm:text-base">
                <li>
                  <span className="font-semibold text-ink">Color: </span>
                  a primary red (<code className="font-mono">#D20A11</code>)
                  against near-black text (
                  <code className="font-mono">#030303</code>) and a set of
                  neutral surface/border tones.
                </li>
                <li>
                  <span className="font-semibold text-ink">Spacing: </span>
                  a defined scale from 2px up to 120px.
                </li>
                <li>
                  <span className="font-semibold text-ink">
                    Border radius:{" "}
                  </span>
                  only two options — sharp (0) or fully round (100px), no
                  in-between values.
                </li>
                <li>
                  <span className="font-semibold text-ink">
                    Interaction detail:{" "}
                  </span>
                  annotated skeleton loading states for the &quot;My
                  Skills&quot; table and &quot;Luca&apos;s Picks&quot;
                  cards, an empty state (&quot;No skills tracked yet. Start
                  your first lesson.&quot;), and dynamic overlays for a
                  weekly challenge, an Ask-a-Chef chat input, and a guided
                  breathing / well-being session.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <Kicker>Live prototype</Kicker>
            <FigmaEmbed
              fileKey="uuDXGI4ppJTTvwjodTGOHx"
              fileName="Chef Coach"
              nodeId="84:779"
              title="Chef Coach dashboard prototype"
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
