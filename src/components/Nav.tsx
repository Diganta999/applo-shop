"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export function Nav() {
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    return pathname === href ? "text-foreground" : "";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 mx-auto w-[80%] z-50 px-4 sm:px-6 py-4">
      <div className="w-full flex items-center justify-between glass-panel rounded-2xl px-5 sm:px-6 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tighter uppercase text-foreground">
          Applo
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-foreground/80">
          <Link href="/products" className={getLinkClass("/products")}>
            Products
          </Link>
          {user && (
            <Link href="/orders" className={getLinkClass("/orders")}>
              Orders
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className={getLinkClass("/admin")}>
              Admin
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={signOut}
              className="text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-foreground min-h-[44px] px-2"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-foreground min-h-[44px] flex items-center px-2"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/cart"
            className="px-3 py-2 min-h-[44px] flex items-center rounded-full border border-foreground/20 text-[10px] font-mono uppercase tracking-widest text-foreground hover:bg-foreground/10 transition-colors"
          >
            Cart ({count})
          </Link>
        </div>
      </div>
    </nav>
  );
}
