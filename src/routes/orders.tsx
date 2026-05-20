import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Your orders — Vitreous" }] }),
  component: Orders,
});

function Orders() {
  const { user, loading } = useAuth();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,total_cents,status,created_at,order_items(product_name,quantity,unit_price_cents)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (loading) return null;
  if (!user) {
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-md mx-auto glass-panel rounded-3xl p-10 text-center">
            <h1 className="text-2xl font-extrabold mb-4">Sign in to view orders</h1>
            <Link to="/login" search={{ redirect: "/orders" }} className="glass-btn inline-flex items-center">
              Sign in
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-12 animate-fade-up">Orders</h1>
          {isLoading ? (
            <p className="text-foreground/60">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center">
              <p className="text-foreground/70 mb-6">No orders yet.</p>
              <Link to="/products" className="glass-btn inline-flex items-center">
                Start browsing
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="glass-panel rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                        {new Date(o.created_at).toLocaleDateString()} · {o.status}
                      </p>
                      <p className="font-mono text-xs text-foreground/40">#{o.id.slice(0, 8)}</p>
                    </div>
                    <div className="font-mono font-extrabold text-lg">
                      {formatPrice(o.total_cents)}
                    </div>
                  </div>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    {o.order_items.map((it, i) => (
                      <li key={i} className="flex justify-between">
                        <span>
                          {it.product_name} × {it.quantity}
                        </span>
                        <span className="font-mono">
                          {formatPrice(it.unit_price_cents * it.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
