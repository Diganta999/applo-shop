import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { resolveProductImage } from "@/lib/images";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { add } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <p className="text-foreground/60">Loading…</p>
          ) : !product ? (
            <div className="glass-panel rounded-3xl p-12 text-center">
              <p className="text-foreground/70">Product not found.</p>
              <Link to="/products" className="glass-btn mt-6 inline-flex items-center">
                Back to catalog
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-mocha/40 border border-foreground/5 animate-fade-up">
                <img
                  src={resolveProductImage(product.name, product.image_url)}
                  alt={product.name}
                  width={1024}
                  height={1280}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
                <span className="text-caramel font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
                  {product.tagline ?? "Vitreous edition"}
                </span>
                <h1 className="text-5xl font-extrabold tracking-tight mb-6">{product.name}</h1>
                <p className="font-mono text-lg text-foreground/80 mb-8">
                  {formatPrice(product.price_cents)}
                </p>
                <p className="text-foreground/70 leading-relaxed mb-10 max-w-prose">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => {
                      add({ id: product.id, name: product.name, priceCents: product.price_cents });
                      toast.success(`Added ${product.name} to cart`);
                    }}
                    className="glass-btn"
                  >
                    Add to bag
                  </button>
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground/40">
                    {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
