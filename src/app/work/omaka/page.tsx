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

// Full-resolution pages (1400 x 788), captured losslessly from the Behance originals.
const slide = (k: number) => `/images/work/omaka/slide-${String(k).padStart(2, "0")}.webp`;

export default function OmakaPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader kicker="Case Study · Solo · Branding · Brand Book" title="OMAKA — brand book" />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide(2)}
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
              ].map((alt, k) => ({ src: slide(k + 1), alt }))}
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
