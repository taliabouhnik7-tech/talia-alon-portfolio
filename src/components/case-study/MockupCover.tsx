import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function MockupCover({
  src,
  alt,
  priority = false,
  fit = "contain",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  fit?: "contain" | "cover";
}) {
  return (
    <Reveal>
      <div className="overflow-hidden rounded-sm border border-border-strong bg-paper">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 60vw, 90vw"
            className={
              fit === "cover"
                ? "object-cover"
                : "object-contain p-4 sm:p-8"
            }
          />
        </div>
      </div>
    </Reveal>
  );
}
