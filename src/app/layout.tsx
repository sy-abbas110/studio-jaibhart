
import type { Metadata } from 'next';
import './globals.css';
// Header and Footer are now conditionally rendered by ConditionalHeaderFooter
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext'; 
import { ConditionalHeaderFooter } from '@/components/layout/conditional-header-footer';

export const metadata: Metadata = {
  title: 'Jai Bharat Showcase',
  description: 'Student record showcase platform for Jai Bharat Paramedical Institute of Management Groups, Ghazipur.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <ConditionalHeaderFooter>
            {children}
          </ConditionalHeaderFooter>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
