import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/format";
import { placeOrder } from "@/lib/orders.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Vitreous" }] }),
  component: Checkout,
});

function Checkout() {
  const { items, totalCents, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const submitOrder = useServerFn(placeOrder);
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-md mx-auto glass-panel rounded-3xl p-10 text-center">
            <h1 className="text-2xl font-extrabold mb-4">Sign in to checkout</h1>
            <p className="text-foreground/60 mb-6">You need an account to place an order.</p>
            <Link to="/login" search={{ redirect: "/checkout" }} className="glass-btn inline-flex items-center">
              Sign in
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setBusy(true);
    try {
      const result = await submitOrder({
        data: {
          shippingAddress: address,
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        },
      });
      clear();
      toast.success("Order placed");
      navigate({ to: "/orders" });
      void result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
          <form onSubmit={onSubmit} className="glass-bright rounded-3xl p-8 space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight">Shipping</h1>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest mb-2 block">
                Address
              </span>
              <textarea
                required
                minLength={5}
                maxLength={500}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                placeholder="Street, City, Postal code, Country"
                className="w-full rounded-xl bg-white/60 border-2 border-black/15 p-4 font-medium focus:outline-none focus:border-black"
              />
            </label>
            <button
              type="submit"
              disabled={busy || items.length === 0}
              className="w-full h-[54px] bg-black text-white border-2 border-black rounded-2xl font-extrabold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all disabled:opacity-40"
            >
              {busy ? "Placing…" : `Pay ${formatPrice(totalCents)}`}
            </button>
          </form>
          <aside className="glass-panel rounded-3xl p-8 h-fit">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-6 text-foreground/60">
              Order summary
            </h2>
            <div className="space-y-3 mb-6">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span>
                    {i.name} <span className="opacity-50">× {i.quantity}</span>
                  </span>
                  <span className="font-mono">{formatPrice(i.priceCents * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t border-foreground/10">
              <span className="font-extrabold">Total</span>
              <span className="font-mono font-extrabold">{formatPrice(totalCents)}</span>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
