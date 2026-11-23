import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import FactGrid from "@/components/case-study/FactGrid";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import Kicker from "@/components/Kicker";
import ScreenRow from "@/components/case-study/ScreenRow";
import ProblemDecision from "@/components/case-study/ProblemDecision";

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
            <Kicker>The flow</Kicker>
            <p className="mb-8 text-base leading-relaxed text-ink-secondary sm:text-lg">
              From the first screen to your own profile, in the order a new user
              meets them.
            </p>
            <ScreenRow
              screens={[
                { src: "/images/work/spark/welcome.webp", alt: "SPARK welcome screen: Learn like you scroll", caption: "Welcome. One promise and one main action." },
                { src: "/images/work/spark/signup.webp", alt: "SPARK sign-up screen with name, email and password", caption: "Sign up. Three fields, nothing else." },
                { src: "/images/work/spark/feed.webp", alt: "SPARK video feed with a science video and action buttons", caption: "Feed. Full-screen video, the question as the caption." },
                { src: "/images/work/spark/explore.webp", alt: "SPARK explore screen with search, trending topics and topic cards", caption: "Explore. Search, trending topics, and cards that ask a question." },
                { src: "/images/work/spark/profile.webp", alt: "SPARK profile with interests, videos and replies", caption: "Profile. Interests you can edit, your videos and replies." },
              ]}
            />
          </section>

          <section>
            <Kicker>Key decisions</Kicker>
            <div className="space-y-4">
              <ProblemDecision
                title="A question, not a title"
                problem="A topic name like “Astronomy” gives no reason to stop scrolling."
                decision="Every video and card leads with a question: “Is the moon actually bigger near the horizon?”, “Why is the sky actually blue?”. Curiosity does the work a thumbnail usually does."
              />
              <ProblemDecision
                title="Showing where the facts come from"
                problem="The lessons are AI-generated, so users need a way to check them."
                decision="A shield icon on every video opens a Sources sheet that links to the original references, such as NASA Science, Sky & Telescope and the American Psychological Association."
              />
              <ProblemDecision
                title="Familiar gestures, a new purpose"
                problem="A new learning app has to be learned before it can teach anything."
                decision="The feed borrows patterns people already know from short-video apps: vertical swipe, like, comment, save and share on the right edge, and a four-tab bar at the bottom."
              />
            </div>
          </section>

          <section>
            <Kicker>Trust built in</Kicker>
            <div className="grid items-center gap-8 sm:grid-cols-[1fr_1.1fr]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/work/spark/sources.webp"
                alt="The Sources sheet listing NASA Science, Sky & Telescope and the American Psychological Association"
                width={804}
                height={752}
                loading="lazy"
                className="block h-auto w-full rounded-[14px] ring-1 ring-rule"
              />
              <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
                The Sources sheet slides up over the video, so checking a fact
                never means leaving the lesson. Each source opens in one tap.
              </p>
            </div>
          </section>

          <section>
            <Kicker>Design system</Kicker>
            <FactGrid
              facts={[
                { label: "Dark mode", description: "Near-black surfaces so the videos carry the colour, with one bright teal accent for what is active." },
                { label: "States", description: "Every icon and chip has a default and an active state, built as Figma component variants." },
                { label: "Category labels", description: "A small label on each video and card (Science, Physics, Psychology) tells you the subject at a glance." },
                { label: "Tools", description: "Designed in Figma, with Lovable used alongside it." },
              ]}
            />
          </section>

          <section>
            <Kicker>Try the prototype</Kicker>
            <FigmaEmbed fileKey="Q9MFFJCJAWS7Cco8mSn6l0" fileName="SPARK" nodeId="23:885" title="SPARK clickable prototype" />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
