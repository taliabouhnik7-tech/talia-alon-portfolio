import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import FactGrid from "@/components/case-study/FactGrid";
import Kicker from "@/components/Kicker";
import ProblemDecision from "@/components/case-study/ProblemDecision";

export const metadata: Metadata = {
  title: "Chef Coach | Talia Alon",
  description:
    "A culinary training dashboard built around an AI coach: skill tracking, personalized recommendations, and community support for kitchen professionals.",
};

export default function ChefCoachPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Solo · AI Coaching Platform"
          title="Chef Coach"
          context="Solo project. The screen layout came out of a stakeholder interview."
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <MockupCover
            src="/images/work/chef-coach-cover.png"
            alt="Chef Coach dashboard shown on a laptop mockup"
            priority
          />

          <section>
            <Kicker>About this project</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              A culinary training dashboard built around an AI coach:
              skill tracking, personalized recommendations, and community
              support for kitchen professionals.
            </p>
          </section>

          <section>
            <Kicker>Research</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              A product design document with three personas, a 13-scenario use
              case script and a competitor analysis, plus a stakeholder
              interview that defined the screen layout.
            </p>
          </section>

          <section>
            <Kicker>Key decisions</Kicker>
            <div className="space-y-4">
              <ProblemDecision
                title="Check-in, not Start a Shift"
                problem="The coach is used off service, not during a shift in the kitchen."
                decision="Renamed the entry point from “Start a Shift” to “Check-in”, so the language matches when people actually use it."
              />
              <ProblemDecision
                title="Mastery, not leaderboards"
                problem="How to show a cook’s progress over time."
                decision="Rank progression based on mastering skills, with no leaderboards."
              />
              <ProblemDecision
                title="A habit loop, not an addiction loop"
                problem="There was a request for more “addictive” engagement mechanics."
                decision="Kept engagement to habit-building: a short check-in, a coach tone each user picks (supportive or tough), and a wellbeing zone for pressure."
              />
            </div>
          </section>

          <section>
            <Kicker>Try the prototype</Kicker>
            <FigmaEmbed
              fileKey="uuDXGI4ppJTTvwjodTGOHx"
              fileName="Chef Coach"
              nodeId="197:5143"
              title="Chef Coach live prototype"
            />
          </section>

          <section>
            <Kicker>Design system</Kicker>
            <p className="mb-6 text-base leading-relaxed text-ink-secondary sm:text-[17px]">
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
                    "Only two options: sharp (0) or fully round (100px), no in-between values.",
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
