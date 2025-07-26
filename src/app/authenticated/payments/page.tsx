
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import type { Payment, PaymentStatistics, Client, PaymentFormValues } from '@/types';
import { PaymentDataTable } from '@/components/payments/payment-data-table';
import { getPaymentColumns } from '@/components/payments/payment-table-columns';
import { AddPaymentDialog } from '@/components/payments/add-payment-dialog';
import { ViewPaymentDialog } from '@/components/payments/view-payment-dialog';
import { MetricCard } from '@/components/dashboard/metric-card';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllPayments, 
  addPayment as addPaymentToDb, 
  updatePayment as updatePaymentInDb, 
  getPaymentStatisticsFromDb,
  getAllClients 
} from '@/lib/mock-db';

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [clients, setClients] = React.useState<Pick<Client, 'id' | 'name'>[]>([]);
  const [statistics, setStatistics] = React.useState<PaymentStatistics | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [paymentData, statsData, clientData] = await Promise.all([
        getAllPayments(),
        getPaymentStatisticsFromDb(),
        getAllClients().then(cls => cls.map(c => ({ id: c.id, name: c.name })))
      ]);
      setPayments(paymentData);
      setStatistics(statsData);
      setClients(clientData);
    } catch (error) {
      toast({ title: "Erro ao carregar dados", description: "Não foi possível buscar os pagamentos ou estatísticas.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    document.title = "Gerenciamento de Pagamentos | Crédito Simples";
    fetchData();
  }, []);

  const handleAddOrUpdatePayment = async (values: PaymentFormValues) => {
    try {
      const client = clients.find(c => c.id === values.clientId);
      if (!client) {
        toast({ title: "Erro", description: "Cliente não encontrado.", variant: "destructive" });
        return;
      }

      if (editingPayment) {
        const paymentToUpdate: Payment = {
            ...editingPayment,
            ...values,
            clientName: client.name, 
            date: new Date(values.date), // Ensure date is a Date object
            amount: Number(values.amount) // Ensure amount is a number
        };
        await updatePaymentInDb(paymentToUpdate);
        toast({ title: "Pagamento Atualizado!", description: `Pagamento para ${client.name} atualizado.` });
      } else {
        const paymentToAdd: Omit<Payment, 'id' | 'clientName'> & { clientId: string } = {
            clientId: values.clientId,
            date: new Date(values.date),
            amount: Number(values.amount),
            method: values.method,
            status: values.status,
        };
        await addPaymentToDb(paymentToAdd);
        toast({ title: "Pagamento Adicionado!", description: `Novo pagamento para ${client.name} registrado.` });
      }
      await fetchData(); // Refresh data
      setEditingPayment(null);
      setIsAddDialogOpen(false);
      // router.refresh(); // Re-run server components if necessary
    } catch (error) {
      toast({ title: "Erro", description: `Falha ao salvar pagamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, variant: "destructive" });
    }
  };

  const handleOpenAddDialog = () => {
    setEditingPayment(null);
    setIsAddDialogOpen(true);
  };
  
  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setIsAddDialogOpen(true); 
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };

  const handleUpdatePaymentStatus = async (payment: Payment, status: Payment['status']) => {
    try {
      await updatePaymentInDb({ ...payment, status });
      await fetchData(); // Refresh data
      toast({ title: "Status do Pagamento Atualizado!", description: `Pagamento de ${payment.clientName} marcado como ${status}.` });
    } catch (error) {
       toast({ title: "Erro", description: "Falha ao atualizar status do pagamento.", variant: "destructive" });
    }
  }
  
  const columns = React.useMemo(() => getPaymentColumns(handleEditPayment, handleViewPayment, handleUpdatePaymentStatus), [clients]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciamento de Pagamentos</h1>
        <Button onClick={handleOpenAddDialog} variant="default" className="shadow-md">
          <Icons.add className="mr-2 h-5 w-5" />
          Adicionar Pagamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Recebido"
          value={statistics ? `R$ ${statistics.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Carregando..."}
          icon={Icons.dollarSign}
          isLoading={isLoading && !statistics}
          description="Soma de todos os pagamentos 'Pagos'"
        />
        <MetricCard
          title="Total Pendente"
          value={statistics ? `R$ ${statistics.totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Carregando..."}
          icon={Icons.dollarSign} 
          isLoading={isLoading && !statistics}
          description="Soma dos pagamentos 'Pendentes'"
        />
        <MetricCard
          title="Total Atrasado"
          value={statistics ? `R$ ${statistics.totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Carregando..."}
          icon={Icons.warning}
          isLoading={isLoading && !statistics}
          description="Soma dos pagamentos 'Atrasados'"
        />
        <MetricCard
          title="Pagamentos (Últimos 30 dias)"
          value={statistics ? statistics.paymentsLast30Days.toString() : "Carregando..."}
          icon={Icons.payments}
          isLoading={isLoading && !statistics}
          description="Número de pagamentos registrados"
        />
      </div>
      
      <PaymentDataTable columns={columns} data={payments} onAddPayment={handleOpenAddDialog} isLoading={isLoading} />

      <AddPaymentDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddOrUpdatePayment}
        editingPayment={editingPayment}
        clients={clients} 
      />
      <ViewPaymentDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        payment={selectedPayment}
      />
    </div>
  );
}
