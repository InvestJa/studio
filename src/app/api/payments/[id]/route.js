import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paymentData = await request.json();
    
    // Get old payment data to calculate balance changes
    const oldPayment = dbOperations.getAllPayments.all().find(p => p.id === params.id);
    
    // Update payment
    dbOperations.updatePayment.run(
      paymentData.amount,
      paymentData.date,
      paymentData.method,
      paymentData.status,
      params.id
    );

    // Update client balance based on status changes
    if (oldPayment) {
      const client = dbOperations.getClientById.get(oldPayment.client_id);
      if (client) {
        let balanceAdjustment = 0;
        
        // If status changed from non-Paid to Paid
        if (oldPayment.status !== 'Pago' && paymentData.status === 'Pago') {
          balanceAdjustment -= paymentData.amount;
        }
        // If status changed from Paid to non-Paid
        else if (oldPayment.status === 'Pago' && paymentData.status !== 'Pago') {
          balanceAdjustment += oldPayment.amount;
        }
        // If status is still Paid but amount changed
        else if (oldPayment.status === 'Pago' && paymentData.status === 'Pago' && oldPayment.amount !== paymentData.amount) {
          balanceAdjustment = oldPayment.amount - paymentData.amount;
        }
        
        if (balanceAdjustment !== 0) {
          const newBalance = Math.max(0, client.outstanding_balance + balanceAdjustment);
          dbOperations.updateClientBalance.run(newBalance, client.id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update payment error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}