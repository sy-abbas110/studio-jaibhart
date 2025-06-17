
"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode, Dispatch, SetStateAction} from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { LoadingSpinner } from "@/components/admin/shared/loading-spinner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    if (!loading && user && pathname === "/admin/login") {
      router.push("/admin/dashboard");
    }
  }, [user, loading, router, pathname]);


  if (loading && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return <div className="flex h-screen w-screen items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
