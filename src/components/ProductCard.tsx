"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { resolveProductImage } from "@/lib/images";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

interface Props {
  product: {
    id: string;
    name: string;
    price_cents: number;
    image_url: string | null;
    tagline: string | null;
  };
  delayMs?: number;
}

export function ProductCard({ product, delayMs = 0 }: Props) {
  const { add } = useCart();
  const img = resolveProductImage(product.name, product.image_url);

  return (
    <article className="group relative animate-fade-up" style={{ animationDelay: `${delayMs}ms` }}>
      <Link
        href={`/products/${product.id}`}
        className="block w-full aspect-[4/5] bg-mocha/30 rounded-3xl border border-foreground/5 overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]"
      >
        <Image
          src={img}
          alt={product.name}
          width={800}
          height={1000}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="mt-5 flex justify-between items-center glass-bright p-5 rounded-2xl gap-3">
        <div className="min-w-0">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-extrabold text-lg tracking-tight truncate">{product.name}</h3>
          </Link>
          <p className="text-black/60 text-sm font-mono">{formatPrice(product.price_cents)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            add({ id: product.id, name: product.name, priceCents: product.price_cents });
            toast.success(`Added ${product.name}`);
          }}
          className="h-11 px-5 bg-white/30 border-2 border-black/15 rounded-xl font-extrabold text-black text-xs uppercase tracking-tight hover:bg-black hover:text-white transition-colors shrink-0"
        >
          Add
        </button>
      </div>
    </article>
  );
}
