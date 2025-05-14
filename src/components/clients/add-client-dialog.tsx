
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
import type { Client } from '@/types';

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (clientValues: ClientFormValues) => Promise<void>; // Callback after attempting save
  editingClient?: Client | null; // Client data if editing
}

export function AddClientDialog({ isOpen, onOpenChange, onSave, editingClient }: AddClientDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: ClientFormValues) => {
    setIsSubmitting(true);
    await onSave(values); // Parent page handles actual saving and toast
    setIsSubmitting(false);
    // onOpenChange(false); // Parent should close dialog on success if needed
  };

  // Reset form when dialog opens/closes or editingClient changes
  // The form itself handles its default values based on initialData (editingClient)
  // So, no specific reset logic needed here other than what ClientForm provides

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // Potentially reset editingClient state in parent if dialog is closed by 'X' or overlay click
      }
      onOpenChange(open);
    }}>
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
