const skills = [
  "User research",
  "Information architecture",
  "Wireframes and prototypes",
  "Design systems",
  "RTL interfaces",
  "Mobile-first design",
  "Branding",
  "Figma, Illustrator, Photoshop",
  "Building with AI tools",
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-rule">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <h2 className="text-[40px] font-semibold leading-none tracking-[-0.03em] text-graphite sm:text-[56px]">About</h2>

        <div className="max-w-[62ch]">
          <div className="space-y-5 text-lg leading-[1.65] text-graphite">
            <p>
              I have a B.Sc. in Cognitive &amp; Brain Sciences from Ben Gurion University, with a
              minor in math. Before design I taught STEM and tutored math one on one for years.
            </p>
            <p className="text-graphite-soft">
              Teaching is where I learned to research. When a student is stuck, the question they
              ask is rarely the real problem. I bring the same habit to interviews and usability
              tests: slow down, find the real question, and design for how people think rather than
              how a spec assumes they think.
            </p>
            <p className="text-graphite-soft">
              I also have a clear line. I design habit loops that respect people, not addiction
              loops that use them, and I say so when a brief asks for the second.
            </p>
          </div>

          <h3 className="mt-12 text-[15px] text-graphite-soft">What I work on</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {skills.map((s) => (
              <li key={s} className="rounded-full bg-frame px-3.5 py-1.5 text-[15px] text-graphite ring-1 ring-rule">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
