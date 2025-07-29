import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Gerencie seus clientes e finanças.',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Bem-vindo de volta, {user.name}!
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">Aqui você verá as métricas e gerenciará seus clientes e pagamentos.</p>
        <div className="flex gap-4 pt-4">
          <Button asChild>
            <Link href="/clients">Gerenciar Clientes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}