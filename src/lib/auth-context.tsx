import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refreshSession() {
    setLoading(true);
    try {
      const stored = localStorage.getItem("mock_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setIsAdmin(u.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (e) {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  const signOut = async () => {
    localStorage.removeItem("mock_user");
    await refreshSession();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
