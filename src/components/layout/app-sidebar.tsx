"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/layout/logo';
import { mainNavItems } from '@/config/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '../icons';

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;

  return (
    <Sidebar side="left" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Logo iconOnly={isCollapsed} />
        {!isMobile && state === "expanded" && <SidebarTrigger />}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={isCollapsed ? item.title : undefined}
                  disabled={item.disabled}
                  className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.title}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        {/* Placeholder for potential footer items like dark mode toggle or help */}
         {!isCollapsed && (
            <Button variant="outline" className="w-full" disabled>
                <Icons.settings className="mr-2" />
                Mais Opções
            </Button>
         )}
         {isCollapsed && (
            <Button variant="outline" size="icon" disabled>
                <Icons.settings />
            </Button>
         )}
      </SidebarFooter>
    </Sidebar>
  );
}
