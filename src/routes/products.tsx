import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All vessels — Vitreous" },
      { name: "description", content: "Browse the full Vitreous catalog of frosted brown glass vessels." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price_cents,image_url,tagline")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16 animate-fade-up">
            <span className="text-caramel font-mono text-xs uppercase tracking-[0.3em] mb-3 block">
              Catalog
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">All Vessels</h1>
          </header>

          {isLoading ? (
            <p className="text-foreground/60">Loading…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} delayMs={i * 80} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
