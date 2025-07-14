import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  Edit3,
  Eye,
  LogOut,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  UserCircle,
  Menu,
  Moon,
  Sun,
  BarChart,
  PieChart,
  FileText,
  Mail,
  Bell,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Icons = {
  logo: Briefcase, // Using Briefcase as a placeholder logo icon
  dashboard: LayoutDashboard,
  clients: Users,
  settings: Settings,
  payments: CreditCard,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  moreHorizontal: MoreHorizontal,
  add: PlusCircle,
  search: Search,
  delete: Trash2,
  edit: Edit3,
  view: Eye,
  logout: LogOut,
  dollarSign: DollarSign,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: XCircle,
  user: UserCircle,
  menu: Menu,
  moon: Moon,
  sun: Sun,
  barChart: BarChart,
  pieChart: PieChart,
  fileText: FileText,
  mail: Mail,
  bell: Bell,
  mapPin: MapPin,
  spinner: ({ className, ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};