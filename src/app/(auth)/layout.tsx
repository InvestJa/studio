import { Icons } from '@/components/icons';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8 text-primary">
          <Icons.logo className="h-10 w-10 mr-3" />
          <h1 className="text-3xl font-bold">{APP_NAME}</h1>
        </Link>
        <div className="bg-card p-8 rounded-lg shadow-xl">
          {children}
        </div>
         <p className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
