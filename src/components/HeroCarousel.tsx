"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { carouselImages } from "@/lib/images";
import { Button } from "@/components/ui/button";

export default function HeroCarousel() {
  const images = carouselImages;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(t);
  }, [images.length]);

  // navigation removed (buttons hidden) — carousel is auto-advancing and dots are available

  return (
    <div className="relative w-full mx-auto aspect-4/3 md:aspect-3/1 rounded-4xl overflow-hidden animate-fade-up" style={{ animationDelay: "150ms" }}>
      <div className="absolute inset-0 z-0">
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={src}
              alt={`Hero ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/10 z-10 mix-blend-overlay"></div>

      <div className="absolute inset-x-0 bottom-4 md:bottom-6 z-20 flex justify-center px-4">
        <div className="glass-panel rounded-2xl px-2 py-1 md:px-3 md:py-2 pl-4 md:pl-6 w-[95%] text-left bg-black/40 backdrop-blur-md border-white/10 text-white shadow-2xl mx-auto">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-[9px] px-2 py-0 rounded-full mb-1 uppercase tracking-wider font-mono">Featured</span>
          <h3 className="text-sm md:text-lg font-bold mb-0">Collections curated for you</h3>
          <p className="text-white/70 text-[11px] md:text-sm leading-relaxed truncate">Discover premium pieces selected for quality and design.</p>
        </div>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-3 z-30 flex gap-2">
        {images.map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            onClick={() => setIndex(i)}
            className={`w-2 h-2 p-0 min-w-0 min-h-0 border-none outline-none shadow-none rounded-full hover:bg-transparent ${i === index ? "bg-white" : "bg-white/40"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
