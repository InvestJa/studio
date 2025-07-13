"use client";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { isMobile } = useSidebar();

  return (
    <header className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "shadow-sm" 
      )}>
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
        {isMobile && <SidebarTrigger className="mr-2 md:hidden" />}
        {/* Add Breadcrumbs or Page Title here if needed */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
