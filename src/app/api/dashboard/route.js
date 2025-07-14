import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = dbOperations.getDashboardMetrics.get();
    const paymentStats = dbOperations.getPaymentStatistics.get();

    const dashboardData = {
      totalClients: metrics.total_clients,
      totalLoanedAmount: metrics.total_loaned_amount,
      totalOutstandingAmount: metrics.total_outstanding_amount,
      defaultRate: metrics.default_rate,
      paymentStatistics: {
        totalPaid: paymentStats.total_paid,
        totalPending: paymentStats.total_pending,
        totalOverdue: paymentStats.total_overdue,
        paymentsLast30Days: paymentStats.payments_last_30_days
      }
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}