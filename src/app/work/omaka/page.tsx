import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import FactGrid from "@/components/case-study/FactGrid";
import BehanceLink from "@/components/case-study/BehanceLink";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "OMAKA brand book | Talia Alon",
  description: "Brand identity and brand book for Omaka, a sushi brand: logo, typography and colour rules.",
};

export default function OmakaPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader kicker="Case Study · Solo · Branding · Brand Book" title="OMAKA — brand book" />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <MockupCover src="/images/work/omaka-cover.webp" alt="The Omaka logo: two white rings forming a fish, above the name in red" priority fit="cover" />

          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 border-y border-border py-6 text-sm sm:grid-cols-2">
            <div className="flex gap-2"><dt className="font-semibold text-ink">Role:</dt><dd className="text-ink-secondary">Brand identity, solo</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Deliverable:</dt><dd className="text-ink-secondary">Brand book</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Tools:</dt><dd className="text-ink-secondary">Illustrator, Photoshop</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Year:</dt><dd className="text-ink-secondary">2026</dd></div>
          </dl>

          <section className="space-y-5 text-base leading-relaxed text-ink-secondary sm:text-lg">
            <p>
              Omaka is a sushi brand. I designed its identity and wrote the brand book that keeps it consistent
              wherever it appears.
            </p>
          </section>

          <section>
            <Kicker>What&apos;s in the brand book</Kicker>
            <FactGrid
              facts={[
                { label: "Logo", description: "Two rings that overlap to form a fish, simple enough to work as an icon on its own." },
                { label: "Typography", description: "Comfortaa for the logo and across the brand, rounded to echo the circles in the mark." },
                { label: "Colour", description: "Black, white and a single strong red, so the name stands out wherever it sits." },
                { label: "Usage", description: "Rules for applying the mark and type, so the brand looks the same every time." },
              ]}
            />
          </section>

          <BehanceLink href="https://www.behance.net/gallery/246033875/OMAKA-Brand-Book-2026" />
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
