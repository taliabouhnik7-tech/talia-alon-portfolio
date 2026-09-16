import Kicker from "@/components/Kicker";

const skills = [
  "Figma",
  "UX Research",
  "Design Systems",
  "Wireframing & Prototyping",
  "Branding",
  "RTL Design",
  "Mobile-First",
  "Illustrator",
  "Photoshop",
  "AI-Assisted Development",
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
      <Kicker>About</Kicker>
      <h2 className="mb-8 font-serif text-3xl text-ink sm:text-4xl">
        From cognitive science and the classroom, into product design.
      </h2>

      <div className="space-y-5 text-base leading-relaxed text-ink-secondary sm:text-lg">
        <p>
          I hold a B.Sc. in Cognitive &amp; Brain Sciences from Ben Gurion
          University, with a minor in mathematics. Before design, I spent
          years teaching STEM and tutoring math one-on-one — work that shaped
          how I approach user research and persona building today: slow
          down, ask the question behind the question, and design for how
          people actually think, not how a spec assumes they think.
        </p>
        <p>
          That background also shapes where I draw the line. I care about
          non-manipulative design. I think in terms of a habit loop, not an
          addiction loop, and I push back on requests that lean the other
          way.
        </p>
      </div>

      <div className="mt-10 border-l-2 border-accent pl-6">
        <p className="font-serif text-lg leading-relaxed text-ink sm:text-xl">
          A habit loop respects the person using it. An addiction loop
          exploits them. I design for the first — and I&apos;ll say so when a
          brief is asking for the second.
        </p>
      </div>

      <h3 className="mt-12 mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-ink">
        Skills &amp; tools
      </h3>
      <ul className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-border-strong px-4 py-1.5 text-sm text-ink-secondary"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
