import { StaticImageData } from "next/image";
import basin from "@/assets/product-basin.jpg";
import carafe from "@/assets/product-carafe.jpg";
import obelisk from "@/assets/product-obelisk.jpg";
import jar from "@/assets/product-jar.jpg";
import candle from "@/assets/product-candle.jpg";
import vessel from "@/assets/product-vessel.jpg";
import hero from "@/assets/hero-construction.png";

export const heroImage = hero;

// Export a small curated set of local images for the homepage carousel.
export const carouselImages: (StaticImageData | string)[] = [
  // Wide, product-focused Unsplash images (landscape hero size)
  "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop",
  // fallback to local hero if remote fails
  hero,
];

// Map by product name (seed names are stable).
const map: Record<string, StaticImageData> = {
  "Umber Basin": basin,
  "Dusk Carafe": carafe,
  "Obelisk Lamp": obelisk,
  "Resin Jar": jar,
  "Ember Holder": candle,
  "Root Vessel": vessel,
};

export function resolveProductImage(name: string, fallback?: string | null): StaticImageData | string {
  return map[name] ?? fallback ?? vessel;
}
