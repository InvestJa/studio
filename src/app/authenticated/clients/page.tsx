
"use client"; 

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ClientDataTable } from '@/components/clients/client-data-table';
import { getClientColumns } from '@/components/clients/client-table-columns';
import type { Client, ClientFormValues } from '@/types';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { AddClientDialog } from '@/components/clients/add-client-dialog';
import { ViewClientDialog } from '@/components/clients/view-client-dialog';
import { useToast } from '@/hooks/use-toast';
import { getAllClients, addClient, updateClient as updateClientInDb } from '@/lib/mock-db';


export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = React.useState<Client[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    setIsLoading(true);
    const data = await getAllClients();
    setClients(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    document.title = "Gerenciamento de Clientes | Crédito Simples";
    fetchClients();
  }, []);

  const handleAddOrUpdateClient = async (values: ClientFormValues) => {
    try {
      if (editingClient) {
        await updateClientInDb(values, editingClient.id);
        toast({ title: "Cliente Atualizado!", description: `Cliente ${values.name} atualizado com sucesso.` });
      } else {
        await addClient(values);
        toast({ title: "Cliente Adicionado!", description: `Cliente ${values.name} adicionado com sucesso.` });
      }
      await fetchClients(); // Re-fetch all clients to update the list
      setEditingClient(null);
      setIsAddDialogOpen(false);
      // router.refresh(); // Re-run server components if necessary for other parts of the UI
    } catch (error) {
      toast({ title: "Erro", description: `Falha ao salvar cliente: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, variant: "destructive" });
    }
  };

  const handleOpenAddDialog = () => {
    setEditingClient(null);
    setIsAddDialogOpen(true);
  };
  
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsAddDialogOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };
  
  const columns = React.useMemo(() => getClientColumns(handleEditClient, handleViewClient), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciamento de Clientes</h1>
        <Button onClick={handleOpenAddDialog} variant="default" className="shadow-md">
          <Icons.add className="mr-2 h-5 w-5" />
          Adicionar Cliente
        </Button>
      </div>
      
      <ClientDataTable columns={columns} data={clients} onAddClient={handleOpenAddDialog} isLoading={isLoading} />

      <AddClientDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddOrUpdateClient} // Changed prop name for clarity
        editingClient={editingClient}
      />
      <ViewClientDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        client={selectedClient}
      />
    </div>
  );
}
