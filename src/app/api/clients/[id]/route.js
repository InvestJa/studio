import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = dbOperations.getClientById.get(params.id);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const paymentHistory = dbOperations.getPaymentsByClientId.all(client.id);

    const formattedClient = {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      document: client.document,
      loanAmount: client.loan_amount,
      loanTerm: client.loan_term,
      interestRate: client.interest_rate,
      outstandingBalance: client.outstanding_balance,
      registrationDate: new Date(client.registration_date),
      paymentHistory: paymentHistory.map(payment => ({
        id: payment.id,
        clientId: payment.client_id,
        clientName: client.name,
        date: new Date(payment.date),
        amount: payment.amount,
        method: payment.method,
        status: payment.status
      }))
    };

    return NextResponse.json(formattedClient);
  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientData = await request.json();
    
    dbOperations.updateClient.run(
      clientData.name,
      clientData.email,
      clientData.phone,
      clientData.document,
      clientData.loanAmount,
      clientData.loanTerm,
      clientData.interestRate,
      clientData.outstandingBalance || clientData.loanAmount,
      params.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    dbOperations.deleteClient.run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete client error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}