// @ts-nocheck
// Simple in-memory mock database
// In a real app, this would be replaced by actual database interactions (e.g., Firebase Firestore)

import type { Client, Payment, DashboardMetrics, ClientFormValues, PaymentFormValues } from '@/types';

let clients: Client[] = [
  { id: 'cl001', name: 'Ana Silva', email: 'ana.silva@example.com', phone: '(11) 98765-4321', document: '123.456.789-10', loanAmount: 5000, loanTerm: 12, interestRate: 2.5, outstandingBalance: 2500, registrationDate: new Date('2023-01-15'), paymentHistory: [{id: 'p001', clientId: 'cl001', clientName: 'Ana Silva', date: new Date('2023-02-15'), amount: 470, method: 'PIX', status: 'Pago'}] },
  { id: 'cl002', name: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(21) 91234-5678', document: '987.654.321-00', loanAmount: 10000, loanTerm: 24, interestRate: 2.0, outstandingBalance: 8000, registrationDate: new Date('2023-03-10'), paymentHistory: [{id: 'p002', clientId: 'cl002', clientName: 'Bruno Costa', date: new Date('2023-04-10'), amount: 460, method: 'Boleto', status: 'Pago'}] },
  { id: 'cl003', name: 'Carla Dias', email: 'carla.dias@example.com', phone: '(31) 95555-5555', document: '111.222.333-44', loanAmount: 7500, loanTerm: 18, interestRate: 2.2, outstandingBalance: 0, registrationDate: new Date('2022-11-05'), paymentHistory: [{id: 'p003', clientId: 'cl003', clientName: 'Carla Dias', date: new Date('2022-12-05'), amount: 450, method: 'Cartão de Crédito', status: 'Pago'}] },
  { id: 'cl004', name: 'Daniel Oliveira', email: 'daniel.oliveira@example.com', phone: '(41) 94444-4444', document: '444.555.666-77', loanAmount: 12000, loanTerm: 36, interestRate: 1.8, outstandingBalance: 12000, registrationDate: new Date('2024-01-20'), paymentHistory: [] },
  { id: 'cl005', name: 'Eduarda Ferreira', email: 'eduarda.ferreira@example.com', phone: '(51) 93333-3333', document: '777.888.999-00', loanAmount: 3000, loanTerm: 6, interestRate: 3.0, outstandingBalance: 1500, registrationDate: new Date('2023-08-01'), paymentHistory: [{id: 'p004', clientId: 'cl005', clientName: 'Eduarda Ferreira', date: new Date('2023-09-01'), amount: 500, method: 'PIX', status: 'Atrasado'}] },
];

let payments: Payment[] = [
  { id: 'pay001', clientId: 'cl001', clientName: 'Ana Silva', date: new Date('2024-05-15'), amount: 470, method: 'PIX', status: 'Pago' },
  { id: 'pay002', clientId: 'cl002', clientName: 'Bruno Costa', date: new Date('2024-05-10'), amount: 460, method: 'Boleto', status: 'Pendente' },
  { id: 'pay003', clientId: 'cl003', clientName: 'Carla Dias', date: new Date('2024-04-20'), amount: 450, method: 'Cartão de Crédito', status: 'Pago' },
  { id: 'pay004', clientId: 'cl001', clientName: 'Ana Silva', date: new Date('2024-04-15'), amount: 470, method: 'PIX', status: 'Atrasado' },
  { id: 'pay005', clientId: 'cl004', clientName: 'Daniel Oliveira', date: new Date('2024-05-01'), amount: 500, method: 'PIX', status: 'Falhou' },
  { id: 'pay006', clientId: 'cl005', clientName: 'Eduarda Ferreira', date: new Date('2024-03-25'), amount: 520, method: 'Boleto', status: 'Pago' },
  { id: 'pay007', clientId: 'cl002', clientName: 'Bruno Costa', date: new Date('2024-04-10'), amount: 460, method: 'Boleto', status: 'Pago' },
];

// Client Functions
export function getAllClients(): Promise<Client[]> {
  return Promise.resolve([...clients]); // Return a copy
}

export function addClient(clientData: ClientFormValues): Promise<Client> {
  const newClient: Client = {
    id: `cl${Date.now()}${Math.random().toString(16).slice(2,6)}`, // More unique ID
    ...clientData,
    outstandingBalance: clientData.loanAmount, // Initially, outstanding is full amount
    paymentHistory: [],
    registrationDate: new Date(),
  };
  clients.push(newClient);
  return Promise.resolve(newClient);
}

export function updateClient(updatedClientData: ClientFormValues, clientId: string): Promise<Client | null> {
  const clientIndex = clients.findIndex(c => c.id === clientId);
  if (clientIndex === -1) return Promise.resolve(null);

  const existingClient = clients[clientIndex];
  const updatedClient: Client = {
    ...existingClient,
    ...updatedClientData,
    // Recalculate outstandingBalance if loanAmount changes and it's not a new loan scenario
    // For simplicity, if loanAmount changes, we assume it's an adjustment, not new payments.
    // A more complex system would handle this differently.
    outstandingBalance: updatedClientData.loanAmount !== existingClient.loanAmount 
        ? updatedClientData.loanAmount - (existingClient.loanAmount - existingClient.outstandingBalance) // Adjust based on previous payments if loan amount changed
        : existingClient.outstandingBalance, 
  };
  clients[clientIndex] = updatedClient;
  return Promise.resolve(updatedClient);
}

export function getClientById(id: string): Promise<Client | undefined> {
    return Promise.resolve(clients.find(c => c.id === id));
}


// Payment Functions
export function getAllPayments(): Promise<Payment[]> {
  return Promise.resolve([...payments]); // Return a copy
}

export function addPayment(paymentData: Omit<Payment, 'id' | 'clientName'> & { clientId: string }): Promise<Payment> {
  const client = clients.find(c => c.id === paymentData.clientId);
  if (!client) {
    return Promise.reject(new Error("Client not found for payment"));
  }

  const newPayment: Payment = {
    id: `pay${Date.now()}${Math.random().toString(16).slice(2,6)}`,
    clientName: client.name,
    ...paymentData,
  };
  payments.push(newPayment);

  // Update client's outstanding balance and payment history
  if (newPayment.status === 'Pago') {
    client.outstandingBalance -= newPayment.amount;
    if (client.outstandingBalance < 0) client.outstandingBalance = 0; // Cannot be negative
  }
  client.paymentHistory.push(newPayment);
  updateClient(client, client.id); // Persist client changes

  return Promise.resolve(newPayment);
}

export function updatePayment(updatedPaymentData: Payment): Promise<Payment | null> {
  const paymentIndex = payments.findIndex(p => p.id === updatedPaymentData.id);
  if (paymentIndex === -1) return Promise.resolve(null);

  const oldPayment = payments[paymentIndex];
  payments[paymentIndex] = { ...oldPayment, ...updatedPaymentData };
  const updatedPayment = payments[paymentIndex];

  // Adjust client's outstanding balance if payment status or amount changed
  const client = clients.find(c => c.id === updatedPayment.clientId);
  if (client) {
    let balanceAdjustment = 0;
    // If status changed from non-Paid to Paid
    if (oldPayment.status !== 'Pago' && updatedPayment.status === 'Pago') {
      balanceAdjustment -= updatedPayment.amount;
    }
    // If status changed from Paid to non-Paid
    else if (oldPayment.status === 'Pago' && updatedPayment.status !== 'Pago') {
      balanceAdjustment += oldPayment.amount; // Add back the old amount
    }
    // If status is still Paid but amount changed
    else if (oldPayment.status === 'Pago' && updatedPayment.status === 'Pago' && oldPayment.amount !== updatedPayment.amount) {
      balanceAdjustment = oldPayment.amount - updatedPayment.amount; // Difference
    }
    
    client.outstandingBalance += balanceAdjustment;
    if (client.outstandingBalance < 0) client.outstandingBalance = 0;

    // Update payment in client's history
    const paymentInHistoryIndex = client.paymentHistory.findIndex(p => p.id === updatedPayment.id);
    if (paymentInHistoryIndex !== -1) {
      client.paymentHistory[paymentInHistoryIndex] = updatedPayment;
    }
    updateClient(client, client.id);
  }
  
  return Promise.resolve(updatedPayment);
}


// Dashboard Data Function
export async function getDashboardDataFromDb(): Promise<DashboardMetrics> {
  const allClients = await getAllClients();
  const allPayments = await getAllPayments();

  const totalClients = allClients.length;
  const totalLoanedAmount = allClients.reduce((sum, client) => sum + client.loanAmount, 0);
  const totalOutstandingAmount = allClients.reduce((sum, client) => sum + client.outstandingBalance, 0);

  // Simplified default rate: percentage of clients with outstanding balance > 0
  const clientsWithDebt = allClients.filter(client => client.outstandingBalance > 0).length;
  const defaultRate = totalClients > 0 ? (clientsWithDebt / totalClients) * 100 : 0;
  
  // Simulate some trend data (in a real app, this would come from historical data)
  // For now, trends on dashboard cards will remain static or be removed if confusing

  return {
    totalClients,
    totalLoanedAmount,
    totalOutstandingAmount,
    defaultRate,
  };
}

// Payment Statistics for Payments Page
export async function getPaymentStatisticsFromDb(): Promise<{ totalPaid: number; totalPending: number; totalOverdue: number; paymentsLast30Days: number }> {
  const currentPayments = await getAllPayments();
  const totalPaid = currentPayments.filter(p => p.status === 'Pago').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = currentPayments.filter(p => p.status === 'Pendente').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = currentPayments.filter(p => p.status === 'Atrasado').reduce((sum, p) => sum + p.amount, 0);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const paymentsLast30Days = currentPayments.filter(p => new Date(p.date) >= thirtyDaysAgo).length;

  return { totalPaid, totalPending, totalOverdue, paymentsLast30Days };
}
