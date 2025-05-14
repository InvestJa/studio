
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
// import { PaymentForm, type PaymentFormValues } from "./payment-form"; // Future: use a dedicated form
import { useToast } from "@/hooks/use-toast";
import type { Payment, Client } from '@/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AddPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentAdded: (newPayment: Payment) => void; 
  editingPayment?: Payment | null;
  clients: Pick<Client, 'id' | 'name'>[]; // To select a client
}

// Placeholder: In a real app, this would involve a proper form and validation.
export function AddPaymentDialog({ 
    isOpen, 
    onOpenChange, 
    onPaymentAdded, 
    editingPayment,
    clients 
}: AddPaymentDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Simplified state for a placeholder form
  const [amount, setAmount] = React.useState(editingPayment?.amount.toString() || '');
  const [selectedClientId, setSelectedClientId] = React.useState(editingPayment?.clientId || '');
  const [paymentDate, setPaymentDate] = React.useState(editingPayment?.date ? editingPayment.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = React.useState<Payment['method']>(editingPayment?.method || 'PIX');
  const [paymentStatus, setPaymentStatus] = React.useState<Payment['status']>(editingPayment?.status || 'Pendente');


  React.useEffect(() => {
    if (editingPayment) {
      setAmount(editingPayment.amount.toString());
      setSelectedClientId(editingPayment.clientId);
      setPaymentDate(editingPayment.date.toISOString().split('T')[0]);
      setPaymentMethod(editingPayment.method);
      setPaymentStatus(editingPayment.status);
    } else {
      // Reset form for new payment
      setAmount('');
      setSelectedClientId(clients.length > 0 ? clients[0].id : '');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('PIX');
      setPaymentStatus('Pendente');
    }
  }, [editingPayment, isOpen, clients]);


  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Basic validation
    if (!selectedClientId || !amount || !paymentDate) {
        toast({ title: "Erro", description: "Por favor, preencha todos os campos obrigatórios.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) {
        toast({ title: "Erro", description: "Cliente inválido selecionado.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 500));
      const paymentData: Payment = {
        id: editingPayment?.id || `pay-${Date.now()}`, // Use existing ID if editing
        clientId: selectedClientId,
        clientName: client.name,
        amount: parseFloat(amount),
        date: new Date(paymentDate),
        method: paymentMethod,
        status: paymentStatus,
      };
      onPaymentAdded(paymentData);
      toast({
        title: editingPayment ? "Pagamento Atualizado!" : "Pagamento Adicionado!",
        description: `Pagamento para ${client.name} foi ${editingPayment ? 'atualizado' : 'adicionado'}.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar pagamento",
        description: "Ocorreu um problema.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        
        {/* Placeholder Form - Replace with <PaymentForm /> when implemented */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">Cliente</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                    {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Valor (R$)</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Data</Label>
            <Input id="date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method" className="text-right">Método</Label>
            <Select value={paymentMethod} onValueChange={(value: Payment['method']) => setPaymentMethod(value)}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                    {(['PIX', 'Boleto', 'Cartão de Crédito', 'Dinheiro'] as Payment['method'][]).map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={paymentStatus} onValueChange={(value: Payment['status']) => setPaymentStatus(value)}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                    {(['Pendente', 'Pago', 'Atrasado', 'Falhou'] as Payment['status'][]).map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (editingPayment ? "Salvar Alterações" : "Adicionar Pagamento")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
