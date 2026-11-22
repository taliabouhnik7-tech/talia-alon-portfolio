import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import SlideStack from "@/components/case-study/SlideStack";
import FactGrid from "@/components/case-study/FactGrid";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "OMAKA brand book | Talia Alon",
  description: "Brand identity and brand book for Omaka, a sushi brand: logo, typography and colour rules.",
};

// The original full-resolution pages, served from Talia's Behance project.
const SRC = "https://mir-s3-cdn-cf.behance.net/project_modules/source/";
const SLIDES = ["e6c5c0246033875.69babb6a90488.png", "a4b88b246033875.69babb6a942b3.png", "ad968f246033875.69babb6a90a15.png", "9fe3f4246033875.69babb6a9144c.png", "3ee516246033875.69babb6a90f01.png", "0e503d246033875.69babb6a93e8e.png", "5c29f3246033875.69babb6a92d78.png", "feb19d246033875.69babb6a93897.png", "1ff862246033875.69babb6a93259.png", "08fccf246033875.69babb6a91e8b.png", "7cf3f8246033875.69babb6a92868.png", "f5ef25246033875.69babb6a92387.png", "33b59b246033875.69babb6a9198a.png"];

export default function OmakaPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader kicker="Case Study · Solo · Branding · Brand Book" title="OMAKA — brand book" />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${SRC}${SLIDES[1]}`}
            alt="The Omaka logo: two white rings forming a fish, above the name in red"
            width={1400}
            height={788}
            className="block h-auto w-full rounded-[12px] bg-[#f3f3f3]"
          />

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
                { label: "Typography", description: "Comfortaa, a rounded typeface, for the logo and across the brand." },
                { label: "Colour", description: "Black, white and a single strong red, so the name stands out wherever it sits." },
                { label: "Applications", description: "Business cards, signage, posters, a billboard, social posts and stories, and branded chopsticks." },
              ]}
            />
          </section>

          <section>
            <Kicker>The brand book</Kicker>
            <p className="mb-6 text-ink-secondary">All 13 pages, in order.</p>
            <SlideStack
              slides={[
                "Cover",
                "Primary logo",
                "Logo versions: colour, outline and white",
                "Typography: Comfortaa for the logo and the brand",
                "Brand colours: white, red and black",
                "Business cards",
                "Roll-up banner: one bite, endless joy",
                "Instagram post",
                "Poster for new club members",
                "Instagram story",
                "Billboard: Roll into Love",
                "Branded chopsticks",
                "Thank you",
              ].map((alt, k) => ({ src: `${SRC}${SLIDES[k]}`, alt }))}
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
