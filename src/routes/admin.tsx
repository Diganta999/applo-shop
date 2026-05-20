import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/format";
import { createProduct, deleteProduct } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Vitreous" }] }),
  component: Admin,
});

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const qc = useQueryClient();
  const create = useServerFn(createProduct);
  const del = useServerFn(deleteProduct);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price_cents,stock,tagline")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [form, setForm] = useState({ name: "", tagline: "", priceCents: 10000, stock: 10 });
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (!user) {
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-md mx-auto glass-panel rounded-3xl p-10 text-center">
            <h1 className="text-2xl font-extrabold mb-4">Sign in required</h1>
            <Link to="/login" search={{ redirect: "/admin" }} className="glass-btn inline-flex items-center">
              Sign in
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-md mx-auto glass-panel rounded-3xl p-10 text-center">
            <h1 className="text-2xl font-extrabold mb-2">Admins only</h1>
            <p className="text-foreground/60 text-sm">Your account doesn't have admin access.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await create({ data: form });
      toast.success("Product added");
      setForm({ name: "", tagline: "", priceCents: 10000, stock: 10 });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await del({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr,1.4fr] gap-8">
          <form onSubmit={onCreate} className="glass-bright rounded-3xl p-8 space-y-4 h-fit">
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">New product</h2>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-12 rounded-xl bg-white/60 border-2 border-black/15 px-4 font-medium"
            />
            <input
              placeholder="Tagline"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full h-12 rounded-xl bg-white/60 border-2 border-black/15 px-4 font-medium"
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-mono uppercase tracking-widest mb-2 block">Price (¢)</span>
                <input
                  type="number"
                  min={0}
                  value={form.priceCents}
                  onChange={(e) => setForm({ ...form, priceCents: parseInt(e.target.value) || 0 })}
                  className="w-full h-12 rounded-xl bg-white/60 border-2 border-black/15 px-4 font-medium"
                />
              </label>
              <label className="block">
                <span className="text-xs font-mono uppercase tracking-widest mb-2 block">Stock</span>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                  className="w-full h-12 rounded-xl bg-white/60 border-2 border-black/15 px-4 font-medium"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full h-[54px] bg-black text-white border-2 border-black rounded-2xl font-extrabold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all disabled:opacity-40"
            >
              {busy ? "Saving…" : "Add product"}
            </button>
          </form>

          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-foreground/60 mb-4">
              Catalog ({products.length})
            </h2>
            <ul className="divide-y divide-foreground/10">
              {products.map((p) => (
                <li key={p.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-extrabold truncate">{p.name}</p>
                    <p className="font-mono text-xs text-foreground/50">
                      {formatPrice(p.price_cents)} · {p.stock} in stock
                    </p>
                  </div>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-destructive min-h-[44px] px-3"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
