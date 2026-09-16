import Kicker from "@/components/Kicker";
import PlaceholderImage from "@/components/PlaceholderImage";

type Moment = {
  number: string;
  title: string;
  problem: string;
  decision: string;
  why: string;
};

const moments: Moment[] = [
  {
    number: "01",
    title: "A mobile pattern that didn't belong on desktop",
    problem:
      "The category switcher was a filled, pill-shaped toggle — natural on a phone, but once the layout opened up to desktop width, it read as an app control sitting inside a website.",
    decision:
      "Kept the filled pill on mobile. On desktop, gave it an outlined treatment that matches the site's other buttons, with a filled state only when a category is active.",
    why: "The two versions needed to feel like the same product, not identical controls — each one native to how people actually tap or click at that size.",
  },
  {
    number: "02",
    title: "A header pattern that changed its mind by screen width",
    problem:
      "The decorative stripe pattern behind the logo scaled unevenly across phone widths — a different number of stripes depending on the device, some barely wide enough to register. It read as noise, not a calm brand backdrop.",
    decision:
      "Rebuilt it as a single CSS gradient locked to exactly seven equal-width stripes at any screen size — an odd count so the strong brand color always lands on both outer edges.",
    why: "A pattern that shifts density with viewport width reads as accidental. One that holds its rhythm at every size reads as designed.",
  },
  {
    number: "03",
    title: "An order summary with no clear focal point",
    problem:
      "Early cart rows gave the photo, category badge, product name, price, and quantity control equal visual weight. Nothing told the eye where to land — the screen felt cluttered despite holding very little information.",
    decision:
      "Rebuilt the hierarchy so price is the dominant element in every row, the product name reads clearly but secondary, and the quantity/remove controls pull back to a quiet, outlined style.",
    why: "The price is what a customer checks twice before sending an order. Everything else in the row should support that glance, not compete with it.",
  },
  {
    number: "04",
    title: "A stepper that only needs to be loud sometimes",
    problem:
      "A full-width +/- stepper worked well as an 'add to cart' action, but felt oversized and out of place once a product already had a quantity attached, especially inside the compact cart list.",
    decision:
      "Designed a two-state control: a small, quiet count badge at rest, which expands into a compact +/- stepper on demand and collapses again once you're done.",
    why: "The interaction only earns visual prominence at the moment someone is actually using it — the rest of the time, it should read as information, not an invitation to act.",
  },
  {
    number: "05",
    title: "An admin built for the person who'd actually use it",
    problem:
      "Every price update, new photo, or seasonal promotion would otherwise mean editing code — unworkable for a one-person business with no engineering background.",
    decision:
      "Designed an admin dashboard with a live theme editor — colors, type, and spacing with a real-time preview — plus a built-in check that flags any color pairing failing WCAG contrast before it ships, and simple tools to add curated homepage sections without touching a file.",
    why: "The real 'user' of this screen is a business owner on a busy Tuesday, not a developer in a demo. The design had to hold up under that, not just look good in a walkthrough.",
  },
];

export default function BakeryCaseStudy() {
  return (
    <section
      id="bakery-case-study"
      className="border-y border-border bg-card/60"
    >
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <Kicker>Case Study · Flagship</Kicker>
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">
          Talia Alon Bakery — ordering site &amp; admin system
        </h2>

        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-y border-border py-6 text-sm sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="font-semibold text-ink">Role:</dt>
            <dd className="text-ink-secondary">
              End-to-end design &amp; product direction
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-ink">Scope:</dt>
            <dd className="text-ink-secondary">
              Public ordering site + private admin
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-ink">Tools:</dt>
            <dd className="text-ink-secondary">
              Figma, Claude Code, Supabase, Vercel
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-ink">Timeline:</dt>
            <dd className="text-ink-secondary">2026, ongoing</dd>
          </div>
        </dl>

        <div className="mt-10 space-y-5 text-base leading-relaxed text-ink-secondary sm:text-lg">
          <p>
            The brief was my own. I run a home bakery under my own name, and
            I needed an ordering flow simple enough for a customer to use in
            under a minute — browse, add to an order, send it to me on
            WhatsApp — with no payment processing to manage. I also needed to
            run the business day to day without asking a developer for every
            price change, new photo, or seasonal menu.
          </p>
          <p>
            So I designed the full product in Figma, then directed its build
            into a live, deployed site — making every UX and visual decision
            along the way, from the first wireframe to the shade of a hover
            state.
          </p>
        </div>

        <a
          href="https://talia-alon-bakery-5xt7.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex flex-col gap-1 rounded-sm border border-accent/40 bg-accent/[0.06] px-6 py-5 transition-colors hover:border-accent hover:bg-accent/[0.1] sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.08em] text-accent">
              See it running
            </span>
            <span className="block text-sm text-ink-secondary">
              talia-alon-bakery-5xt7.vercel.app
            </span>
          </span>
          <span className="text-lg text-accent">→</span>
        </a>

        <div className="mt-16 space-y-16">
          {moments.map((moment) => (
            <div key={moment.number} className="grid gap-6 sm:grid-cols-2 sm:gap-10">
              <div className="order-2 sm:order-none">
                <PlaceholderImage label={`Screenshot pending — moment ${moment.number}`} />
              </div>
              <div>
                <p className="font-serif text-4xl text-brass/70">
                  {moment.number}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-ink">
                  {moment.title}
                </h3>
                <div className="mt-5 space-y-4 text-sm leading-relaxed sm:text-base">
                  <p>
                    <span className="font-semibold text-ink">Problem: </span>
                    <span className="text-ink-secondary">{moment.problem}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Decision: </span>
                    <span className="text-ink-secondary">{moment.decision}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Why: </span>
                    <span className="text-ink-secondary">{moment.why}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border-l-2 border-brass pl-6">
          <p className="font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            The site is live and taking real orders. Because the product and
            the admin share one design-token system, I can keep refining the
            visual language — a color, a spacing scale, a whole seasonal
            section — without waiting on a developer for each change. That
            loop, design → ship → observe → refine, is the part of this
            project I&apos;d want to bring into any team I join.
          </p>
        </div>
      </div>
    </section>
  );
}
