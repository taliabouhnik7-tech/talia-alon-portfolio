export default function BehanceLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-1 rounded-[12px] border border-accent/40 bg-accent/[0.06] px-6 py-5 transition-colors hover:border-accent sm:flex-row sm:items-center sm:justify-between"
    >
      <span>
        <span className="block text-[15px] font-semibold text-accent">See the full project on Behance</span>
        <span className="block text-sm text-ink-secondary">Every screen and the complete presentation</span>
      </span>
      <span className="text-[15px] font-medium text-accent">Open Behance</span>
    </a>
  );
}
