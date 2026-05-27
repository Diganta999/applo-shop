"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";import { Card } from "@/components/ui/card";
const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});

export default function SignupPage() {
  const router = useRouter();
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
      toast.success("Account created");
      router.push("/");
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
        <Card className="max-w-md mx-auto glass-bright rounded-3xl p-10 shadow-none border-none" style={{ backgroundColor: "rgb(213,213,213)" }}>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-neutral-900">Create Account</h1>
          <p className="text-neutral-700 text-sm mb-8">Join Vitreous for a faster checkout.</p>
          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-800 mb-2 block">Email</span>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/90 border-2 border-neutral-300 px-4 font-medium text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:border-neutral-900 focus-visible:ring-0 shadow-none text-base"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-800 mb-2 block">
                Password
              </span>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/90 border-2 border-neutral-300 px-4 font-medium text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:border-neutral-900 focus-visible:ring-0 shadow-none text-base"
              />
            </label>
            <Button
              type="submit"
              disabled={busy}
              variant="applo-primary"
              className="w-full h-[54px] rounded-2xl"
            >
              {busy ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <p className="text-sm text-neutral-700 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold text-neutral-900 hover:text-black underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
