"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const filters = [
  { id: "all", label: "All" },
  { id: "Solo", label: "Solo" },
  { id: "Team", label: "Team" },
] as const;

type FilterId = (typeof filters)[number]["id"];

// The four deepest case studies lead; the rest follow as more work.
const FEATURED = ["bakery", "audiocodes", "y-platform", "chef-coach"];
// In More projects, the ones Talia is proudest of take the first row.
const MORE_ORDER = ["bubble", "aloora", "omaka", "spark", "heichal-etzion", "tangled"];

export default function WorkGrid() {
  const [filter, setFilter] = useState<FilterId>("all");
  const list = filter === "all" ? projects : projects.filter((p) => p.role === filter);
  const featured = list.filter((p) => FEATURED.includes(p.slug));
  const more = list
    .filter((p) => !FEATURED.includes(p.slug))
    .sort((a, b) => MORE_ORDER.indexOf(a.slug) - MORE_ORDER.indexOf(b.slug));

  return (
    <section id="work" className="mx-auto w-full max-w-[1200px] scroll-mt-16 px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="flex flex-col gap-5 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[28px] font-semibold tracking-[-0.025em] text-graphite">
          Selected work
        </h2>

        <div role="tablist" aria-label="Filter projects" className="inline-flex self-start rounded-full bg-canvas p-1 sm:self-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-1.5 text-[15px] transition-colors ${
                filter === f.id ? "bg-rule font-medium text-graphite" : "text-graphite-soft hover:text-graphite"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {featured.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} large />
          ))}
        </div>
      )}

      {more.length > 0 && (
        <>
          <h3 className="mt-20 text-[20px] font-semibold tracking-[-0.02em] text-graphite">More projects</h3>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
