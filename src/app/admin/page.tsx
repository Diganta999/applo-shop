import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Applo Shop",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-8">Admin</h1>
          <p>Admin panel is disabled in static mode.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
