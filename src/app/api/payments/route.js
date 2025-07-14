import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payments = dbOperations.getAllPayments.all();
    
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      clientId: payment.client_id,
      clientName: payment.client_name,
      date: new Date(payment.date),
      amount: payment.amount,
      method: payment.method,
      status: payment.status
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paymentData = await request.json();
    const paymentId = uuidv4();
    
    // Create payment
    dbOperations.createPayment.run(
      paymentId,
      paymentData.clientId,
      paymentData.amount,
      paymentData.date,
      paymentData.method,
      paymentData.status
    );

    // Update client balance if payment is successful
    if (paymentData.status === 'Pago') {
      const client = dbOperations.getClientById.get(paymentData.clientId);
      if (client) {
        const newBalance = Math.max(0, client.outstanding_balance - paymentData.amount);
        dbOperations.updateClientBalance.run(newBalance, paymentData.clientId);
      }
    }

    // Get client name for response
    const client = dbOperations.getClientById.get(paymentData.clientId);
    
    const newPayment = {
      id: paymentId,
      clientId: paymentData.clientId,
      clientName: client?.name || 'Unknown',
      date: new Date(paymentData.date),
      amount: paymentData.amount,
      method: paymentData.method,
      status: paymentData.status
    };

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}