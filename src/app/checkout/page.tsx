"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const router = useRouter();
  const total = items.reduce((acc, it) => acc + it.priceCents * it.quantity, 0);

  const onSubmit = () => {
    toast.success("Order placed successfully (Mock)!");
    clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-8">Checkout</h1>
          <p className="mb-4">Total: {formatPrice(total)}</p>
          <Button onClick={onSubmit} variant="applo-glass" className="glass-btn border-none">
            Place Mock Order
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
