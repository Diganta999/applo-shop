import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — Vitreous" }] }),
  component: Login,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});

function Login() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: redirect ?? "/" });
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto glass-bright rounded-3xl p-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Sign in</h1>
          <p className="text-black/60 text-sm mb-8">Welcome back to Vitreous.</p>
          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest mb-2 block">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/60 border-2 border-black/15 px-4 font-medium focus:outline-none focus:border-black"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest mb-2 block">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/60 border-2 border-black/15 px-4 font-medium focus:outline-none focus:border-black"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full h-[54px] bg-black text-white border-2 border-black rounded-2xl font-extrabold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all disabled:opacity-40"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="text-sm text-black/60 mt-6 text-center">
            No account?{" "}
            <Link to="/signup" className="font-extrabold text-black underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
