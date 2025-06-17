
import type { ReactNode } from 'react';

// This layout is for pages outside the main admin dashboard, like the login page.
// It won't have the admin sidebar or header.
export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
