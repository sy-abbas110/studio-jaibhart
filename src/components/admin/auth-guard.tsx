
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/admin/shared/loading-spinner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login" && pathname !== "/admin/register") {
      router.replace("/admin/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
     return <div className="flex h-screen w-screen items-center justify-center"><LoadingSpinner /></div>;
  }

  if (!user && pathname !== "/admin/login" && pathname !== "/admin/register") {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback, show loading or null to prevent rendering children.
    return <div className="flex h-screen w-screen items-center justify-center"><LoadingSpinner /></div>;
  }
  
  // If on login/register page and user is already logged in, AuthContext will redirect.
  // Otherwise, if user is present or on login/register page, render children.
  return <>{children}</>;
}
