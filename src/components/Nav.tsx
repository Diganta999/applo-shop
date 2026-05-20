import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export function Nav() {
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel rounded-2xl px-5 sm:px-6 py-3">
        <Link to="/" className="text-xl font-extrabold tracking-tighter uppercase text-foreground">
          Vitreous
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-foreground/80">
          <Link to="/products" activeProps={{ className: "text-foreground" }}>
            Vessels
          </Link>
          {user && (
            <Link to="/orders" activeProps={{ className: "text-foreground" }}>
              Orders
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" activeProps={{ className: "text-foreground" }}>
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
              to="/login"
              className="text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-foreground min-h-[44px] flex items-center px-2"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/cart"
            className="px-3 py-2 min-h-[44px] flex items-center rounded-full border border-foreground/20 text-[10px] font-mono uppercase tracking-widest text-foreground hover:bg-foreground/10 transition-colors"
          >
            Cart ({count})
          </Link>
        </div>
      </div>
    </nav>
  );
}
