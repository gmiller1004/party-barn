import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gallery | Party Barn",
  description:
    "See our event styling, balloon garlands, and party setups. Celebrations styled with a clean, elevated aesthetic.",
};

const galleryImages = [
  { src: "gallery-pastel-kids-tables-bounce-house-balloons", alt: "Pastel kids' tables with bounce house and balloon garlands" },
  { src: "gallery-slumber-party-teepees-balloon-arch", alt: "Slumber party with teepees and balloon arch" },
  { src: "gallery-dinosaur-safari-table-place-settings-hats", alt: "Dinosaur safari table with place settings and safari hats" },
  { src: "gallery-birthday-balloon-arch-sleepover-lounge", alt: "Birthday balloon arch and sleepover lounge" },
  { src: "gallery-halloween-fall-festival-photo-booth", alt: "Halloween fall festival photo booth" },
  { src: "gallery-mermaid-bounce-house-girls-balloon-garland", alt: "Mermaid party with bounce house and balloon garland" },
  { src: "gallery-pink-balloon-bow-archway-entry", alt: "Pink balloon bow in entryway" },
  { src: "gallery-outdoor-picnic-arch-backdrop-balloons-florals", alt: "Outdoor picnic with arch backdrop and florals" },
  { src: "gallery-easter-spring-dessert-table", alt: "Easter spring dessert table" },
  { src: "gallery-minnie-mouse-pastel-table-setting", alt: "Minnie Mouse pastel table setting" },
  { src: "gallery-harvest-festival-arch-balloons-pumpkins", alt: "Harvest festival arch with balloons and pumpkins" },
  { src: "gallery-baby-shower-florals-onesie-garland", alt: "Baby shower florals and onesie garland" },
];

export default function GalleryPage() {
  return (
    <>
      <section className="section-spacing bg-brand-offwhite">
        <div className="container-narrow">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-brand-copper mb-2">
            Portfolio
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-ink leading-tight">
            Gallery
          </h1>
          <p className="mt-6 text-lg text-brand-ink/85 leading-relaxed max-w-2xl">
            A look at celebrations we&apos;ve styled—balloon garlands, themed
            tables, backdrops, and the kind of details that make moments feel
            special.
          </p>
        </div>
      </section>

      <section className="section-spacing-tight bg-brand-cream/30 pb-20">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map(({ src, alt }) => (
              <div
                key={src}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-brand-cream/50"
              >
                <Image
                  src={`/images/gallery/${src}.webp`}
                  alt={alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
