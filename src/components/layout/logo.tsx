import Link from 'next/link';
import { Icons } from '@/components/icons';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <Link href="/dashboard" className={cn("flex items-center space-x-2 text-primary", className)}>
      <Icons.logo className="h-7 w-7" />
      {!iconOnly && <span className="font-bold text-xl">{APP_NAME}</span>}
    </Link>
  );
}
