import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import BrowserChromeFrame from "@/components/case-study/BrowserChromeFrame";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import PullQuote from "@/components/case-study/PullQuote";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "Tangled Fan Experience | Talia Alon",
  description:
    "A movie-themed microsite tying nostalgia for Tangled to a real cause — ticket proceeds and hair donations supporting cancer patients.",
};

export default function TangledPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Team · Creative Microsite"
          title="Tangled Fan Experience"
          tagline="A movie-themed microsite tying nostalgia for Tangled to a real cause."
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <BrowserChromeFrame
            src="/images/work/tangled.png"
            alt="Tangled microsite screens: a DIY lantern-making card and a hair-donation charity screening card"
            priority
          />

          <section>
            <Kicker>Concept</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              A charity screening where ticket proceeds and an on-site
              hair-donation station support cancer patients — built around
              nostalgia for Tangled rather than treating the film as a
              simple backdrop.
            </p>
          </section>

          <section>
            <Kicker>Research</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              Rewatched the film and reviewed social content and comparable
              sites; identified the audience as girls and women with a
              nostalgic connection to the film. The character&apos;s long
              hair and &quot;chasing a dream&quot; theme led directly to
              pairing the concept with hair donation and cancer-patient
              support, alongside lighter experiences like karaoke mode,
              merch, and an at-home lantern-making kit.
            </p>
          </section>

          <section>
            <Kicker>Decision</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              Built the whole flow around a real-world action tied to the
              film&apos;s central image (hair) rather than treating the
              donation as an afterthought bolted onto a standard ticketing
              site.
            </p>
          </section>

          <section>
            <Kicker>Why</Kicker>
            <PullQuote>
              A nostalgia site with a &quot;donate&quot; button feels
              transactional; anchoring the ask to the film&apos;s own
              symbolism (the braid, the lanterns) made giving feel like part
              of the story rather than an interruption of it.
            </PullQuote>
          </section>

          <section>
            <Kicker>Live prototype</Kicker>
            <FigmaEmbed
              fileKey="TpRdmFdcmavII0exeZN0Ao"
              fileName="Tangled Fan Experience"
              nodeId="811:456"
              title="Tangled Fan Experience presentation prototype"
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
