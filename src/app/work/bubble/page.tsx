import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MockupCover from "@/components/case-study/MockupCover";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import StatGrid from "@/components/case-study/StatGrid";
import TierList from "@/components/case-study/TierList";
import PullQuote from "@/components/case-study/PullQuote";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "Bubble — Social Networking App | Talia Alon",
  description:
    "A location-based messaging app connecting Israelis abroad — research, personas, wireframes, and a Figma prototype.",
};

const scenarios = [
  "A train passenger, lost, with no one nearby to ask for help.",
  "Someone abroad looking for people to share a trip or a villa with.",
  "A woman who has to walk 20 minutes alone at night, and is scared.",
  "Someone who lost their earphones at a train station, hoping a stranger finds them.",
];

export default function BubblePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Team · UX/UI"
          title="Bubble — Social Networking App"
          tagline={`"מחברים בין ישראלים לפי מיקומם" — connecting Israelis abroad by location.`}
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <MockupCover
            src="/images/work/bubble-cover.png"
            alt="Bubble app shown across four phone mockups: map view, list view, proximity chat, and profile menu"
            priority
          />

          <section>
            <Kicker>Concept</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              Bubble connects Israelis abroad by location — a way to find
              nearby people, ask for help, get local recommendations, and
              reunite lost items with their owners, without relying on
              general-purpose social networks.
            </p>
          </section>

          <section>
            <Kicker>Problem</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              There was no centralized place for local info, recommendations,
              or help by location. Existing social networks carry
              antisemitism. Israelis abroad want to know if other Israelis
              are nearby, but there&apos;s no easy way to connect, ask for
              help, or reunite lost items with their owners.
            </p>
          </section>

          <section>
            <Kicker>Research</Kicker>
            <p className="mb-6 text-base leading-relaxed text-ink-secondary sm:text-lg">
              A survey of the target audience surfaced a strong, consistent
              signal: people wanted this to exist, and trusted other
              Israelis specifically to provide it.
            </p>
            <StatGrid
              stats={[
                {
                  value: "93.9%",
                  label: "wanted the ability to get help or talk to people around them",
                },
                {
                  value: "98.5%",
                  label: "believe other Israelis want to help even without knowing them",
                },
                {
                  value: "96.9%",
                  label: "prefer a human recommendation over a business describing itself",
                },
                {
                  value: "89.2%",
                  label: "trust Israelis more specifically when abroad",
                },
              ]}
            />
          </section>

          <section>
            <Kicker>Personas &amp; scenarios</Kicker>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {scenarios.map((scenario) => (
                <li
                  key={scenario}
                  className="rounded-sm border border-border bg-card p-5 text-sm leading-relaxed text-ink-secondary sm:text-base"
                >
                  {scenario}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <Kicker>Decision</Kicker>
            <p className="mb-6 text-base leading-relaxed text-ink-secondary sm:text-lg">
              Prioritized features into three tiers based on user value,
              community value, and development complexity.
            </p>
            <TierList
              tiers={[
                {
                  label: "High priority",
                  items: [
                    "Map with smart filtering",
                    "Proximity-based group chat (“the Bubble”)",
                    "User profiles",
                  ],
                },
                {
                  label: "Medium priority",
                  items: [
                    "Lost & found",
                    "Points",
                    "AI escort-mode for walking alone",
                  ],
                },
                {
                  label: "Low priority",
                  items: ["Dating", "Coupons", "Games"],
                },
              ]}
            />
          </section>

          <section>
            <Kicker>Why</Kicker>
            <PullQuote>
              The research made clear that trust and locality were the real
              product, not a feature list — so the roadmap protected the
              core (finding and safely reaching nearby people) before
              investing in anything that made the app more &quot;fun&quot;
              but less essential.
            </PullQuote>
          </section>

          <section>
            <FigmaEmbed
              fileKey="jF3JgkJZQszBSHgztRcIAl"
              fileName="Bubble"
              nodeId="304:1840"
              title="Bubble live prototype"
            />
          </section>

          <section>
            <Kicker>Presentation</Kicker>
            <FigmaEmbed
              fileKey="jF3JgkJZQszBSHgztRcIAl"
              fileName="Bubble"
              nodeId="1204:645"
              title="Bubble presentation deck"
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
