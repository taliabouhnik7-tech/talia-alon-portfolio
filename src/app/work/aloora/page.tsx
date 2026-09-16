import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import BrowserChromeFrame from "@/components/case-study/BrowserChromeFrame";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import PersonaCard from "@/components/case-study/PersonaCard";
import ProblemDecision from "@/components/case-study/ProblemDecision";
import PullQuote from "@/components/case-study/PullQuote";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "ALOORA — Luxury Jewelry E-commerce | Talia Alon",
  description:
    "A premium jewelry e-commerce experience across web and mobile — where digital convenience meets boutique luxury.",
};

export default function AlooraPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Team · Web & Mobile"
          title="ALOORA — Luxury Jewelry E-commerce"
          tagline="Where Digital Convenience Meets Boutique Luxury."
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <MockupCover
            src="/images/work/aloora-cover.png"
            alt="ALOORA jewelry e-commerce site shown across desktop, laptop, and phone mockups"
            priority
          />

          <section>
            <Kicker>Persona</Kicker>
            <PersonaCard
              name="Maya"
              meta="34 · Product Manager · Tel Aviv"
              description="Maya prefers researching and comparing diamonds online without sales pressure, but is anxious about buying something expensive sight-unseen."
            />
          </section>

          <section className="space-y-5">
            <Kicker>Pain points &amp; decisions</Kicker>
            <ProblemDecision
              title="1. Trust gap in high-value online purchases"
              problem={`"Is it real?" — anxiety about lab-grown vs. natural stones.`}
              decision="Featured international certification badges (GIA/IGI) directly on the homepage for instant credibility."
            />
            <ProblemDecision
              title="2. Scale and proportion are hard to judge on a screen"
              problem={`"Will it suit me?"`}
              decision="Used lifestyle photography on real models so shoppers can see exactly how a piece fits and scales on the body, not just isolated product shots."
            />
            <ProblemDecision
              title={'3. The "digital barrier" of luxury shopping'}
              problem="Cluttered, sale-banner-heavy sites make jewelry feel cheap."
              decision="A high-end editorial layout with full-bleed, edge-to-edge imagery that mimics a luxury magazine rather than a typical storefront."
            />
          </section>

          <section>
            <Kicker>Why</Kicker>
            <PullQuote>
              Each solution traces back to a specific moment of hesitation
              Maya would hit while shopping — the goal wasn&apos;t generic
              &quot;luxury visuals,&quot; it was removing the exact
              frictions that make someone abandon an expensive purchase.
            </PullQuote>
          </section>

          <section>
            <Kicker>Checkout screen</Kicker>
            <BrowserChromeFrame
              src="/images/work/aloora.png"
              alt="ALOORA checkout screen"
            />
          </section>

          <section>
            <Kicker>Live prototype</Kicker>
            <FigmaEmbed
              fileKey="IRFsINNlcfcSURNApbJEKT"
              fileName="ALOORA"
              nodeId="173:31"
              title="ALOORA checkout prototype"
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
