"use client"; // This page needs client-side interactivity for dialogs and table

import * as React from 'react';
// import type { Metadata } from 'next'; // Metadata can still be defined but will be static here
import { ClientDataTable } from '@/components/clients/client-data-table';
import { getClientColumns } from '@/components/clients/client-table-columns';
import type { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { AddClientDialog } from '@/components/clients/add-client-dialog';
import { ViewClientDialog } from '@/components/clients/view-client-dialog';
import { useToast } from '@/hooks/use-toast';

// Static metadata (won't use dynamic values from this client component)
// export const metadata: Metadata = {
//   title: 'Gerenciamento de Clientes',
//   description: 'Visualize e gerencie seus clientes de crédito.',
// };

// Mock data fetching. In a real app, this would be an API call.
async function getClients(): Promise<Client[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
  return [
    { id: 'cl001', name: 'Ana Silva', email: 'ana.silva@example.com', phone: '(11) 98765-4321', document: '123.456.789-10', loanAmount: 5000, loanTerm: 12, interestRate: 2.5, outstandingBalance: 2500, registrationDate: new Date('2023-01-15'), paymentHistory: [{id: 'p001', date: new Date('2023-02-15'), amount: 470, method: 'PIX', status: 'Pago'}] },
    { id: 'cl002', name: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(21) 91234-5678', document: '987.654.321-00', loanAmount: 10000, loanTerm: 24, interestRate: 2.0, outstandingBalance: 8000, registrationDate: new Date('2023-03-10'), paymentHistory: [{id: 'p002', date: new Date('2023-04-10'), amount: 460, method: 'Boleto', status: 'Pago'}] },
    { id: 'cl003', name: 'Carla Dias', email: 'carla.dias@example.com', phone: '(31) 95555-5555', document: '111.222.333-44', loanAmount: 7500, loanTerm: 18, interestRate: 2.2, outstandingBalance: 0, registrationDate: new Date('2022-11-05'), paymentHistory: [{id: 'p003', date: new Date('2022-12-05'), amount: 450, method: 'Cartão de Crédito', status: 'Pago'}] },
    { id: 'cl004', name: 'Daniel Oliveira', email: 'daniel.oliveira@example.com', phone: '(41) 94444-4444', document: '444.555.666-77', loanAmount: 12000, loanTerm: 36, interestRate: 1.8, outstandingBalance: 12000, registrationDate: new Date('2024-01-20'), paymentHistory: [] },
    { id: 'cl005', name: 'Eduarda Ferreira', email: 'eduarda.ferreira@example.com', phone: '(51) 93333-3333', document: '777.888.999-00', loanAmount: 3000, loanTerm: 6, interestRate: 3.0, outstandingBalance: 1500, registrationDate: new Date('2023-08-01'), paymentHistory: [{id: 'p004', date: new Date('2023-09-01'), amount: 500, method: 'PIX', status: 'Atrasado'}] },
  ];
}


export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const { toast } = useToast(); // If needed for actions within the page

  React.useEffect(() => {
    document.title = "Gerenciamento de Clientes | Crédito Simples";
    async function loadClients() {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
      setIsLoading(false);
    }
    loadClients();
  }, []);

  const handleAddOrUpdateClient = (client: Client) => {
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === client.id ? client : c));
    } else {
      setClients(prev => [...prev, client]);
    }
    setEditingClient(null);
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
  
  const columns = React.useMemo(() => getClientColumns(handleEditClient, handleViewClient), [handleEditClient, handleViewClient]);

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
        onClientAdded={handleAddOrUpdateClient}
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
