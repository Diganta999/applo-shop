import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Vitreous" }] }),
  component: Signup,
});

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
});

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: parsed.data.name },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created");
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto glass-bright rounded-3xl p-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create account</h1>
          <p className="text-black/60 text-sm mb-8">Join Vitreous.</p>
          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest mb-2 block">Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/60 border-2 border-black/15 px-4 font-medium focus:outline-none focus:border-black"
              />
            </label>
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
              <span className="text-xs font-mono uppercase tracking-widest mb-2 block">
                Password
              </span>
              <input
                type="password"
                required
                minLength={8}
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
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>
          <p className="text-sm text-black/60 mt-6 text-center">
            Already have one?{" "}
            <Link to="/login" className="font-extrabold text-black underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
