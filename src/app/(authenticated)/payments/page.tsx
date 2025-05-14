
"use client";

import * as React from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import type { Payment, PaymentStatistics, Client } from '@/types';
import { PaymentDataTable } from '@/components/payments/payment-data-table';
import { getPaymentColumns } from '@/components/payments/payment-table-columns';
import { AddPaymentDialog } from '@/components/payments/add-payment-dialog';
import { ViewPaymentDialog } from '@/components/payments/view-payment-dialog';
import { MetricCard } from '@/components/dashboard/metric-card';
import { useToast } from '@/hooks/use-toast';

// Mock client data to associate with payments - in a real app, this might come from a shared store or context
const mockClients: Pick<Client, 'id' | 'name'>[] = [
    { id: 'cl001', name: 'Ana Silva'},
    { id: 'cl002', name: 'Bruno Costa'},
    { id: 'cl003', name: 'Carla Dias'},
    { id: 'cl004', name: 'Daniel Oliveira'},
    { id: 'cl005', name: 'Eduarda Ferreira'},
];

// Mock data fetching. In a real app, this would be an API call.
async function getPayments(): Promise<Payment[]> {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay
  return [
    { id: 'pay001', clientId: 'cl001', clientName: 'Ana Silva', date: new Date('2024-05-15'), amount: 470, method: 'PIX', status: 'Pago' },
    { id: 'pay002', clientId: 'cl002', clientName: 'Bruno Costa', date: new Date('2024-05-10'), amount: 460, method: 'Boleto', status: 'Pendente' },
    { id: 'pay003', clientId: 'cl003', clientName: 'Carla Dias', date: new Date('2024-04-20'), amount: 450, method: 'Cartão de Crédito', status: 'Pago' },
    { id: 'pay004', clientId: 'cl001', clientName: 'Ana Silva', date: new Date('2024-04-15'), amount: 470, method: 'PIX', status: 'Atrasado' },
    { id: 'pay005', clientId: 'cl004', clientName: 'Daniel Oliveira', date: new Date('2024-05-01'), amount: 500, method: 'PIX', status: 'Falhou' },
    { id: 'pay006', clientId: 'cl005', clientName: 'Eduarda Ferreira', date: new Date('2024-03-25'), amount: 520, method: 'Boleto', status: 'Pago' },
    { id: 'pay007', clientId: 'cl002', clientName: 'Bruno Costa', date: new Date('2024-04-10'), amount: 460, method: 'Boleto', status: 'Pago' },
  ];
}

async function getPaymentStatistics(payments: Payment[]): Promise<PaymentStatistics> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const totalPaid = payments.filter(p => p.status === 'Pago').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pendente').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'Atrasado').reduce((sum, p) => sum + p.amount, 0);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const paymentsLast30Days = payments.filter(p => new Date(p.date) >= thirtyDaysAgo).length;

  return { totalPaid, totalPending, totalOverdue, paymentsLast30Days };
}


export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [statistics, setStatistics] = React.useState<PaymentStatistics | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(null); // For future edit functionality
  const { toast } = useToast();

  React.useEffect(() => {
    document.title = "Gerenciamento de Pagamentos | Crédito Simples";
    async function loadData() {
      setIsLoading(true);
      const paymentData = await getPayments();
      setPayments(paymentData);
      const stats = await getPaymentStatistics(paymentData);
      setStatistics(stats);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleAddOrUpdatePayment = (payment: Payment) => {
    // For now, just adds to the list or updates. A real app would POST/PUT to an API.
    if (editingPayment) {
      setPayments(prev => prev.map(p => p.id === payment.id ? payment : p));
      toast({ title: "Pagamento Atualizado!", description: `Pagamento de ${payment.clientName} atualizado.` });
    } else {
      const newPaymentWithId = { ...payment, id: `pay${Math.random().toString(16).slice(2)}`};
      setPayments(prev => [newPaymentWithId, ...prev]);
      toast({ title: "Pagamento Adicionado!", description: `Novo pagamento para ${payment.clientName} registrado.` });
    }
    setEditingPayment(null);
    // Update statistics after adding/updating
    getPaymentStatistics([editingPayment ? payments.map(p => p.id === payment.id ? payment : p) : payment, ...payments]).then(setStatistics);

  };

  const handleOpenAddDialog = () => {
    setEditingPayment(null);
    setIsAddDialogOpen(true);
  };
  
  const handleEditPayment = (payment: Payment) => {
    // For now, this will just open the add dialog with prefilled data (if implemented)
    setEditingPayment(payment);
    setIsAddDialogOpen(true); 
    toast({ title: "Editar Pagamento", description: "Funcionalidade de edição de pagamento em desenvolvimento."});
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };

  const handleUpdatePaymentStatus = (payment: Payment, status: Payment['status']) => {
    setPayments(prev => prev.map(p => p.id === payment.id ? {...p, status} : p));
    getPaymentStatistics(payments.map(p => p.id === payment.id ? {...p, status} : p)).then(setStatistics);
    toast({ title: "Status do Pagamento Atualizado!", description: `Pagamento de ${payment.clientName} marcado como ${status}.` });
  }
  
  const columns = React.useMemo(() => getPaymentColumns(handleEditPayment, handleViewPayment, handleUpdatePaymentStatus), []);


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
          icon={Icons.dollarSign} // Consider Icons.hourglass or similar
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
        onPaymentAdded={handleAddOrUpdatePayment} // This should take a partial Payment or a specific form type
        editingPayment={editingPayment}
        clients={mockClients} // Pass mock clients for selection
      />
      <ViewPaymentDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        payment={selectedPayment}
      />
    </div>
  );
}
