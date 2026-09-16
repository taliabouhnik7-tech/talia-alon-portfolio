import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ContactFooter from "@/components/ContactFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import BrowserChromeFrame from "@/components/case-study/BrowserChromeFrame";
import FigmaEmbed from "@/components/case-study/FigmaEmbed";
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
              Paybox or bank transfer. This project doesn&apos;t have a full
              research deck attached in Figma yet, so this write-up stays
              intentionally brief — the design file and live prototype below
              are the fuller record for now.
            </p>
          </section>

          <section>
            <Kicker>Live prototype</Kicker>
            <FigmaEmbed
              fileKey="UGGXC78wiz9N0wYEXXsfWP"
              fileName="Heichal Etzion"
              nodeId="1:452"
              title="Heichal Etzion donation site prototype"
            />
          </section>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
