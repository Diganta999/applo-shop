"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/mock-data";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const data = await getProducts();
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="w-full mx-auto">
          <header className="mb-16 animate-fade-up">
            <span className="text-caramel font-mono text-xs uppercase tracking-[0.3em] mb-3 block">
              Catalog
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">All Vessels</h1>
          </header>

          {isLoading ? (
            <p className="text-foreground/60">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p as any} delayMs={i * 80} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
