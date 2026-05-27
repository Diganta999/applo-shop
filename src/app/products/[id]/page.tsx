"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/mock-data";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { resolveProductImage } from "@/lib/images";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const ProductMediaGallery = dynamic(() => import("@/components/ProductMediaGallery"), {
  ssr: false,
  loading: () => <div className="w-full aspect-[4/5] bg-mocha/40 rounded-4xl animate-pulse"></div>
});

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { add } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const data = await getProduct(id);
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <p className="text-foreground/60">Loading...</p>
          ) : !product ? (
            <div className="glass-panel rounded-3xl p-12 text-center">
              <p className="text-foreground/70">Product not found.</p>
              <Link href="/products" className="glass-btn mt-6 inline-flex items-center">
                Back to catalog
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <ProductMediaGallery
                  imageSrc={resolveProductImage(product.name, product.image_url)}
                  modelUrl={(product as any).model_url ?? null}
                  videoUrl={(product as any).video_url ?? null}
                  alt={product.name}
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
                  <Button
                    onClick={() => {
                      add({ id: product.id, name: product.name, priceCents: product.price_cents });
                      toast.success("Added " + product.name + " to cart");
                    }}
                    variant="applo-glass"
                    className="glass-btn border-none"
                  >
                    Add to bag
                  </Button>
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground/40">
                    {product.stock > 0 ? product.stock + " in stock" : "Sold out"}
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
