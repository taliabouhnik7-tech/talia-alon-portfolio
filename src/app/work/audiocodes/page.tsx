import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import FactGrid from "@/components/case-study/FactGrid";
import Kicker from "@/components/Kicker";
import StatGrid from "@/components/case-study/StatGrid";

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
          context="A redesign of an existing product, based on interviews with two people who build it: its UI lead and a frontend developer."
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <MockupCover
            src="/images/work/audiocodes-cover.png"
            alt="AudioCodes Meeting Insights shown on a laptop mockup"
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
            <Kicker>Research</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              Interviews with two people who build the product: its UI lead
              and a frontend developer.
            </p>
          </section>

          <section>
            <Kicker>Result</Kicker>
            <p className="mb-6 text-base leading-relaxed text-ink-secondary sm:text-lg">
              The Summary and Transcription views were redesigned, and the
              header went from 18 elements to 4.
            </p>
            <StatGrid
              stats={[
                { value: "18 → 4", label: "Elements in the screen header, before and after" },
                { value: "2", label: "Views redesigned: Summary and Transcription" },
                { value: "2", label: "Stakeholder interviews" },
              ]}
            />
          </section>

          <section>
            <Kicker>Before and after</Kicker>
            <p className="mb-6 text-base leading-relaxed text-ink-secondary sm:text-[17px]">
              The Summary view, as it was and as redesigned. The large AI
              warning above the summary became one line under the assistant,
              the summary got a search field, and the page split into two
              clear panes: the meeting on the left, its content on the right.
            </p>
            <div className="space-y-6">
              {[
                { src: "/images/work/audiocodes-before.webp", label: "Before", alt: "The original Meeting Insights summary screen with a large AI warning banner" },
                { src: "/images/work/audiocodes-after.webp", label: "After", alt: "The redesigned Meeting Insights summary screen with two panes and a search field" },
              ].map((im) => (
                <figure key={im.src}>
                  <figcaption className="mb-2 text-[15px] font-medium text-graphite">{im.label}</figcaption>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.src} alt={im.alt} width={1440} height={900} loading="lazy" className="block h-auto w-full rounded-[10px] ring-1 ring-rule" />
                </figure>
              ))}
            </div>
          </section>

          <section>
            <Kicker>Try the prototype</Kicker>
            <FigmaEmbed
              fileKey="sSPEp6OTLlFkzOQc11lA2k"
              fileName="AudioCodes Meeting Insights"
              nodeId="113:6415"
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
                    "A focused redesign of the product's main meeting-insights screen: navigation and the transcription layout.",
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
