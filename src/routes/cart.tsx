import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — Vitreous" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, totalCents, setQuantity, remove } = useCart();

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-12 animate-fade-up">Basket</h1>

          {items.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center">
              <p className="text-foreground/70 mb-6">Your basket is empty.</p>
              <Link to="/products" className="glass-btn inline-flex items-center">
                Browse vessels
              </Link>
            </div>
          ) : (
            <div className="glass-bright rounded-3xl p-8 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-6 border-b border-black/10 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <h3 className="font-extrabold text-lg">{item.name}</h3>
                    <p className="text-black/60 text-sm font-mono">
                      {formatPrice(item.priceCents)}
                    </p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => setQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-16 h-11 text-center rounded-lg border-2 border-black/15 bg-white/40 font-bold"
                  />
                  <div className="font-mono w-24 text-right">
                    {formatPrice(item.priceCents * item.quantity)}
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-xs font-mono uppercase tracking-widest text-black/50 hover:text-black min-h-[44px] px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <span className="font-extrabold uppercase tracking-widest text-sm">Total</span>
                <span className="font-mono text-2xl font-extrabold">{formatPrice(totalCents)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full inline-flex items-center justify-center h-[54px] bg-black text-white border-2 border-black rounded-2xl font-extrabold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
