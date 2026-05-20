import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { heroImage } from "@/lib/images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitreous — Molten architecture in amber glass" },
      {
        name: "description",
        content: "Hand-poured amber resin vessels, designed to catch the dying light of the afternoon.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price_cents,image_url,tagline")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen">
      <Nav />

      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <span className="text-caramel font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
                New Release / 001
              </span>
              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.9] text-pretty mb-8">
                Molten <br />Architecture
              </h1>
              <p className="max-w-[35ch] text-lg text-foreground/60 mb-10 leading-relaxed">
                Hand-poured amber resin vessels, designed to catch the dying light of the afternoon.
              </p>
              <div className="flex gap-4">
                <Link to="/products" className="glass-btn inline-flex items-center">
                  Explore Series
                </Link>
              </div>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="w-full aspect-[4/5] bg-mocha/40 rounded-[2rem] border border-foreground/5 shadow-2xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="Hand-poured amber glass vase on a dark stone plinth"
                  width={1024}
                  height={1280}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 border-t border-foreground/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight">Curated Selection</h2>
              <Link
                to="/products"
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
