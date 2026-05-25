"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { refreshSession } = useAuth();
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
    try {
      localStorage.setItem(
        "mock_user",
        JSON.stringify({ id: "1", email: parsed.data.email, role: "user" }),
      );
      await refreshSession();
      toast.success("Welcome back");
      router.push(redirect);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto glass-bright rounded-3xl p-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Sign in</h1>
          <p className="text-black/60 text-sm mb-8">Welcome back to Applo Shop.</p>
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
              <span className="text-xs font-mono uppercase tracking-widest mb-2 block">
                Password
              </span>
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
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="text-sm text-black/60 mt-6 text-center">
            No account?{" "}
            <Link href="/signup" className="font-extrabold text-black underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-foreground/60 font-mono text-xs uppercase tracking-widest">Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
