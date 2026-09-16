import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import BrowserChromeFrame from "@/components/case-study/BrowserChromeFrame";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import FactGrid from "@/components/case-study/FactGrid";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "AudioCodes Meeting Insights | Talia Alon",
  description:
    "Stakeholder research and an information-architecture redesign of an enterprise meeting-insights product's main screen.",
};

export default function AudioCodesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Solo · Enterprise SaaS Redesign"
          title="AudioCodes Meeting Insights"
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <BrowserChromeFrame
            src="/images/work/audiocodes.png"
            alt="AudioCodes Meeting Insights main screen"
            priority
          />

          <section>
            <Kicker>About this project</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              Stakeholder research and an information-architecture redesign
              of the product&apos;s main screen, simplifying navigation and
              the transcription layout.
            </p>
          </section>

          <section>
            <FigmaEmbed
              fileKey="qXhax3bbtDxW0wkC8kmnQN"
              fileName="AudioCodes Meeting Insights"
              nodeId="605:3043"
              title="AudioCodes Meeting Insights live prototype"
            />
          </section>

          <section>
            <Kicker>Process &amp; Details</Kicker>
            <FactGrid
              facts={[
                {
                  label: "Scope",
                  description:
                    "A focused redesign of the product's main meeting-insights screen — navigation and the transcription layout.",
                },
                {
                  label: "Approach",
                  description:
                    "Stakeholder research informed the information-architecture decisions behind the redesign.",
                },
                {
                  label: "Role",
                  description: "Solo, end-to-end: research through UI.",
                },
                {
                  label: "Platform",
                  description: "Enterprise desktop SaaS, English UI.",
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
