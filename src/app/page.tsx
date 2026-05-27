"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/mock-data";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";

const HeroCarousel = dynamic(() => import("@/components/HeroCarousel"), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-mocha/20 rounded-3xl animate-pulse"></div>
});

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ["products", "featured", "6"],
    queryFn: async () => {
      const data = await getProducts();
      return data.slice(0, 6);
    },
  });

  return (
    <div className="min-h-screen">
      <Nav />

      <main>
        <section className="pt-32 pb-12 px-6">
          <div className="w-full mx-auto flex flex-col gap-6">
           

            {/* Banner */}
            <HeroCarousel />
          </div>
        </section>

        <section className="px-6 py-24 border-t border-foreground/5">
          <div className="w-full mx-auto">
              <div className="flex justify-between items-end mb-16">
              <h2 className="text-xl font-semibold tracking-tight">All Vessels</h2>
              <Link
                href="/products"
                className="font-mono text-[10px] opacity-60 uppercase tracking-widest hover:opacity-100"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} delayMs={400 + i * 100} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
