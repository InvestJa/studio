
import type { Metadata } from 'next';
import { Icons } from '@/components/icons';
import { MetricCard } from '@/components/dashboard/metric-card';
import { LoansOverviewChart } from '@/components/dashboard/loans-overview-chart';
import { PaymentStatusPieChart } from '@/components/dashboard/payment-status-pie-chart';
import type { DashboardMetrics } from '@/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardDataFromDb } from '@/lib/mock-db'; // Import from mock-db

export const metadata: Metadata = {
  title: 'Dashboard',
};

// Server component to fetch and display metrics
async function MetricsSection() {
  // Fetch metrics from our mock DB
  const metrics = await getDashboardDataFromDb(); 
  return (
    <>
      <MetricCard
        title="Total de Clientes"
        value={metrics.totalClients}
        icon={Icons.clients}
        description="+20.1% desde o último mês" // Trend description kept for UI, actual trend calculation not implemented in mock-db
        trend="up"
        trendValue="+25 novos clientes" // Static trend value
      />
      <MetricCard
        title="Total Emprestado"
        value={`R$ ${metrics.totalLoanedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={Icons.dollarSign}
        description="+15% desde o último mês"
        trend="up"
        trendValue="+ R$ 75.000,00" // Static trend value
      />
      <MetricCard
        title="Saldo Pendente Total"
        value={`R$ ${metrics.totalOutstandingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={Icons.dollarSign} 
        description="Atualizado com base nos dados"
      />
      <MetricCard
        title="Taxa de Inadimplência"
        value={`${metrics.defaultRate.toFixed(1)}%`}
        icon={Icons.warning}
        description="-1.5% desde o último mês" // Static trend description
        trend="down"
        trendValue="Redução de 1.5%" // Static trend value
      />
    </>
  );
}

function MetricsSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
         <MetricCard key={i} title="" value="" icon={Icons.dollarSign} isLoading />
      ))}
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<MetricsSkeleton />}>
          <MetricsSection />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
           <Suspense fallback={<LoansOverviewChart isLoading />}>
            {/* LoansOverviewChart might need to be updated if its data should also be dynamic from mock-db */}
            <LoansOverviewChart />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<PaymentStatusPieChart isLoading />}>
            {/* PaymentStatusPieChart might need to be updated if its data should also be dynamic from mock-db */}
            <PaymentStatusPieChart />
          </Suspense>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Atividade Recente</h3>
            <p className="text-muted-foreground">Nenhuma atividade recente para mostrar. (Placeholder)</p>
        </div>
      </div>
    </div>
  );
}
