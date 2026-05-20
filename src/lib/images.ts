import basin from "@/assets/product-basin.jpg";
import carafe from "@/assets/product-carafe.jpg";
import obelisk from "@/assets/product-obelisk.jpg";
import jar from "@/assets/product-jar.jpg";
import candle from "@/assets/product-candle.jpg";
import vessel from "@/assets/product-vessel.jpg";
import hero from "@/assets/hero-vessel.jpg";

export const heroImage = hero;

// Map by product name (seed names are stable).
const map: Record<string, string> = {
  "Umber Basin": basin,
  "Dusk Carafe": carafe,
  "Obelisk Lamp": obelisk,
  "Resin Jar": jar,
  "Ember Holder": candle,
  "Root Vessel": vessel,
};

export function resolveProductImage(name: string, fallback?: string | null): string {
  return map[name] ?? fallback ?? vessel;
}
