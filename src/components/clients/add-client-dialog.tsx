"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientForm, type ClientFormValues } from "./client-form";
import { useToast } from "@/hooks/use-toast";
import type { Client } from '@/types';

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClientAdded: (newClient: Client) => void; // Callback after successful addition
  editingClient?: Client | null; // Client data if editing
}

// Mock function to simulate saving a client
async function saveClient(clientData: ClientFormValues, existingClient?: Client | null): Promise<Client> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  const newId = existingClient ? existingClient.id : Math.random().toString(36).substr(2, 9);
  const registrationDate = existingClient ? existingClient.registrationDate : new Date();
  const outstandingBalance = existingClient ? existingClient.outstandingBalance : clientData.loanAmount;
  const paymentHistory = existingClient ? existingClient.paymentHistory : [];
  
  return {
    id: newId,
    ...clientData,
    outstandingBalance,
    paymentHistory,
    registrationDate,
  };
}

export function AddClientDialog({ isOpen, onOpenChange, onClientAdded, editingClient }: AddClientDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      const newClientData = await saveClient(values, editingClient);
      onClientAdded(newClientData); // Update client list on parent
      toast({
        title: editingClient ? "Cliente Atualizado!" : "Cliente Adicionado!",
        description: `O cliente ${values.name} foi ${editingClient ? 'atualizado' : 'adicionado'} com sucesso.`,
        variant: "default",
      });
      onOpenChange(false); // Close dialog
    } catch (error) {
      toast({
        title: "Erro ao salvar cliente",
        description: "Ocorreu um problema ao tentar salvar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingClient ? "Editar Cliente" : "Adicionar Novo Cliente"}</DialogTitle>
          <DialogDescription>
            {editingClient ? "Atualize as informações do cliente." : "Preencha os dados abaixo para cadastrar um novo cliente."}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          initialData={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
