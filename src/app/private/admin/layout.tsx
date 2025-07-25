import Nav from "@/components/ui/admin/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Admin",
  description: "This is the admin page for the ROTAS Map",
};

// TODO: add styling

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div>
        <Nav />
      </div>
      {children}
    </div>
  );
}

// TODO: Add side nav for admin pages? - sign-up, reset pword, what else?

/*"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop }
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area }
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header }
        <AppHeader />
        {/* Page Content }
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}*/