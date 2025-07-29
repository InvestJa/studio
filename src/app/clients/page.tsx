import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { getCurrentUser } from '@/lib/auth';
import { dbOperations } from '@/lib/database';
import { ClientTable } from '@/components/clients/client-table';
import { columns } from '@/components/clients/client-table-columns';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Clientes',
  description: 'Gerencie seus clientes.',
};

export default async function ClientsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // The 'better-sqlite3' library is synchronous.
  const clients = dbOperations.getAllClients.all();

  return (
    <div className="container py-10">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Clientes
          </h1>
          <Button asChild>
            <Link href="/clients/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Cliente
            </Link>
          </Button>
        </div>
        <ClientTable columns={columns} data={clients} />
      </section>
    </div>
  );
}