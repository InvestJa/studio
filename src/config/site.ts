import type { NavItem } from '@/types';
import { LayoutDashboard, Users, Settings, CreditCard } from 'lucide-react';

export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Clientes',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Pagamentos',
    href: '/payments',
    icon: CreditCard,
    disabled: true, // Example of a disabled item
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
    disabled: true,
  },
];
