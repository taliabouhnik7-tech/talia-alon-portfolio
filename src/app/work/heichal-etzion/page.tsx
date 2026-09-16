import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import BrowserChromeFrame from "@/components/case-study/BrowserChromeFrame";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
import FactGrid from "@/components/case-study/FactGrid";
import Kicker from "@/components/Kicker";

export const metadata: Metadata = {
  title: "Heichal Etzion | Talia Alon",
  description:
    "A donation landing page for a synagogue's renovation campaign, built for a real community.",
};

export default function HeichalEtzionPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <CaseStudyHeader
          kicker="Case Study · Solo · Real-Client Donation Landing Page"
          title="Heichal Etzion"
        />

        <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
          <BrowserChromeFrame
            src="/images/work/heichal-etzion.png"
            alt="Heichal Etzion donation landing page"
            priority
          />

          <section>
            <Kicker>About this project</Kicker>
            <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
              A donation site for a synagogue&apos;s renovation campaign —
              built for a real community, with a simple flow to give via
              Paybox or bank transfer.
            </p>
          </section>

          <section>
            <FigmaEmbed
              fileKey="UGGXC78wiz9N0wYEXXsfWP"
              fileName="Heichal Etzion"
              nodeId="1:452"
              title="Heichal Etzion live prototype"
            />
          </section>

          <section>
            <Kicker>Process &amp; Details</Kicker>
            <FactGrid
              facts={[
                {
                  label: "Client",
                  description:
                    "A real synagogue renovation campaign — not a self-directed brief.",
                },
                {
                  label: "Flow",
                  description:
                    "A single, focused donation flow: browse the campaign, choose an amount, give via Paybox or bank transfer.",
                },
                {
                  label: "Language",
                  description: "Hebrew, right-to-left layout throughout.",
                },
                {
                  label: "Role",
                  description:
                    "Solo, end-to-end design for a real community stakeholder.",
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
