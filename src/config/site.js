import { LayoutDashboard, Users, Settings, CreditCard } from 'lucide-react';

export const mainNavItems = [
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
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
];