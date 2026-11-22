import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import FactGrid from "@/components/case-study/FactGrid";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "SPARK | Talia Alon",
  description: "A short-video learning app with AI-generated lessons, cliffhanger endings and a community of curious people.",
};

export default function SparkPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader kicker="Case Study · Solo · Mobile App · AI Product" title="SPARK — an AI-powered micro-learning app" />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <MockupCover src="/images/work/spark-cover.webp" alt="SPARK app screens: onboarding, discovery, video feed and profile" priority fit="cover" />

          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 border-y border-border py-6 text-sm sm:grid-cols-2">
            <div className="flex gap-2"><dt className="font-semibold text-ink">Role:</dt><dd className="text-ink-secondary">UX/UI design, solo</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Platform:</dt><dd className="text-ink-secondary">Mobile, dark mode</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Tools:</dt><dd className="text-ink-secondary">Figma, Lovable</dd></div>
            <div className="flex gap-2"><dt className="font-semibold text-ink">Year:</dt><dd className="text-ink-secondary">2026</dd></div>
          </dl>

          <section className="space-y-5 text-base leading-relaxed text-ink-secondary sm:text-lg">
            <p className="text-xl leading-snug font-semibold tracking-[-0.02em] text-ink sm:text-2xl">What if scrolling made you smarter?</p>
            <p>
              People already spend hours a day in short-video feeds. SPARK uses the same habit for learning:
              bite-sized videos with AI-generated content, cliffhanger endings that make you tap &ldquo;next&rdquo;,
              and a community of curious people to learn with.
            </p>
          </section>

          <section>
            <Kicker>Key screens</Kicker>
            <FactGrid
              facts={[
                { label: "Onboarding", description: "One promise, “Learn like you scroll”, and a single clear action to start." },
                { label: "Discover", description: "Search, trending topics and image-led cards that ask a question worth tapping on." },
                { label: "Feed", description: "A full-screen vertical video feed with familiar actions: like, comment, save, share." },
                { label: "Profile", description: "Interests that shape what the AI creates next, from coding to languages." },
              ]}
            />
          </section>

          <section>
            <Kicker>Try the prototype</Kicker>
            <FigmaEmbed fileKey="Q9MFFJCJAWS7Cco8mSn6l0" fileName="Untitled" nodeId="23:885" title="SPARK clickable prototype" />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
