
"use client";
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function ConditionalHeaderFooter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={`flex-grow ${isAdminRoute ? '' : 'container mx-auto px-4 py-8'}`}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
