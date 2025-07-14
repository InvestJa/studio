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

    const clients = dbOperations.getAllClients.all();
    
    // Convert database format to application format
    const formattedClients = clients.map(client => ({
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
      paymentHistory: dbOperations.getPaymentsByClientId.all(client.id).map(payment => ({
        id: payment.id,
        clientId: payment.client_id,
        clientName: client.name,
        date: new Date(payment.date),
        amount: payment.amount,
        method: payment.method,
        status: payment.status
      }))
    }));

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error('Get clients error:', error);
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

    const clientData = await request.json();
    const clientId = uuidv4();
    
    dbOperations.createClient.run(
      clientId,
      clientData.name,
      clientData.email,
      clientData.phone,
      clientData.document,
      clientData.loanAmount,
      clientData.loanTerm,
      clientData.interestRate,
      clientData.loanAmount, // Initial outstanding balance equals loan amount
      user.id
    );

    const newClient = {
      id: clientId,
      ...clientData,
      outstandingBalance: clientData.loanAmount,
      registrationDate: new Date(),
      paymentHistory: []
    };

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}