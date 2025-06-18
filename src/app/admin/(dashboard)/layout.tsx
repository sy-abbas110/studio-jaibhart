
"use client";
import type { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"; 
import { AdminSidebarNav } from "@/components/admin/layout/admin-sidebar-nav";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AuthGuard } from "@/components/admin/auth-guard";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            {/* Logo or Institute Name can go here */}
          </SidebarHeader>
          <SidebarContent>
            <AdminSidebarNav />
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content if any, e.g. logged in user */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <SidebarTrigger className="md:hidden" /> {/* For mobile */}
              <AdminHeader />
            </header>
            <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
              {children}
            </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}

