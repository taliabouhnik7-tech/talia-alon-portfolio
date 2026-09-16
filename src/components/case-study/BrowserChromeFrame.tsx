import Image from "next/image";

export default function BrowserChromeFrame({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-border-strong bg-card">
      <div className="flex items-center gap-1.5 border-b border-border bg-paper px-3.5 py-2">
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-brass/60" />
      </div>
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 60vw, 90vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
