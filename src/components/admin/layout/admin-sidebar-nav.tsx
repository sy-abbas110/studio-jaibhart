
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, UserPlus, FilePlus, Users, FileText } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students/add", label: "Add Student", icon: UserPlus },
  { href: "/admin/students/manage", label: "Manage Students", icon: Users },
  { href: "/admin/certificates/add", label: "Add Certificate", icon: FilePlus },
  { href: "/admin/certificates/manage", label: "Manage Certificates", icon: FileText },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))}
            tooltip={{ children: item.label, side: "right", align: "center" }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
