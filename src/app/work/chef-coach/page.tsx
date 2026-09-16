import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import BrowserChromeFrame from "@/components/case-study/BrowserChromeFrame";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import FactGrid from "@/components/case-study/FactGrid";
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
              support for kitchen professionals.
            </p>
          </section>

          <section>
            <FigmaEmbed
              fileKey="uuDXGI4ppJTTvwjodTGOHx"
              fileName="Chef Coach"
              nodeId="84:779"
              title="Chef Coach live prototype"
            />
          </section>

          <section>
            <Kicker>Process &amp; Details</Kicker>
            <p className="mb-6 text-sm leading-relaxed text-ink-secondary sm:text-base">
              Pulled directly from the file&apos;s own design-tokens
              documentation and behavior annotations.
            </p>
            <FactGrid
              facts={[
                {
                  label: "Color",
                  description:
                    "A primary red (#D20A11) against near-black text (#030303) and a set of neutral surface/border tones.",
                },
                {
                  label: "Spacing",
                  description:
                    "A defined scale from 2px up to 120px.",
                },
                {
                  label: "Border radius",
                  description:
                    "Only two options — sharp (0) or fully round (100px), no in-between values.",
                },
                {
                  label: "Interaction detail",
                  description:
                    "Annotated skeleton loading states for the “My Skills” table and “Luca’s Picks” cards, an empty state (“No skills tracked yet. Start your first lesson.”), and dynamic overlays for a weekly challenge, an Ask-a-Chef chat input, and a guided breathing / well-being session.",
                },
              ]}
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
