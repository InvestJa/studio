
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import type { Payment, Client, PaymentFormValues } from '@/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const paymentFormSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório."),
  amount: z.coerce.number().positive("Valor deve ser positivo."),
  date: z.string().min(1, "Data é obrigatória."), // Will be converted to Date object before saving
  method: z.enum(['PIX', 'Boleto', 'Cartão de Crédito', 'Dinheiro']),
  status: z.enum(['Pendente', 'Pago', 'Atrasado', 'Falhou']),
});


interface AddPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (values: PaymentFormValues) => Promise<void>; 
  editingPayment?: Payment | null;
  clients: Pick<Client, 'id' | 'name'>[];
}

export function AddPaymentDialog({ 
    isOpen, 
    onOpenChange, 
    onSave, 
    editingPayment,
    clients 
}: AddPaymentDialogProps) {
  const { toast } = useToast(); // Keep for potential local messages if needed, parent handles save toasts
  const [isSubmittingLocal, setIsSubmittingLocal] = React.useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      clientId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: 'PIX',
      status: 'Pendente',
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (editingPayment) {
        form.reset({
          clientId: editingPayment.clientId,
          amount: editingPayment.amount,
          date: editingPayment.date ? new Date(editingPayment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          method: editingPayment.method,
          status: editingPayment.status,
        });
      } else {
        form.reset({
          clientId: clients.length > 0 ? clients[0].id : '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          method: 'PIX',
          status: 'Pendente',
        });
      }
    }
  }, [editingPayment, isOpen, clients, form]);


  const onSubmit = async (values: PaymentFormValues) => {
    setIsSubmittingLocal(true);
    await onSave(values);
    setIsSubmittingLocal(false);
    // onOpenChange(false); // Parent should close dialog on success
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingPayment ? "Editar Pagamento" : "Adicionar Novo Pagamento"}</DialogTitle>
          <DialogDescription>
            {editingPayment ? "Atualize os detalhes do pagamento." : "Preencha os dados para registrar um novo pagamento."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['PIX', 'Boleto', 'Cartão de Crédito', 'Dinheiro'] as Payment['method'][]).map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['Pendente', 'Pago', 'Atrasado', 'Falhou'] as Payment['status'][]).map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmittingLocal}>Cancelar</Button>
              <Button type="submit" disabled={isSubmittingLocal}>
                {isSubmittingLocal ? "Salvando..." : (editingPayment ? "Salvar Alterações" : "Adicionar Pagamento")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
