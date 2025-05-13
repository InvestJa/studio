import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  method: 'Cartão de Crédito' | 'Boleto' | 'PIX' | 'Dinheiro';
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Falhou';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF or CNPJ
  loanAmount: number;
  loanTerm: number; // in months
  interestRate: number; // percentage
  outstandingBalance: number;
  paymentHistory: Payment[];
  registrationDate: Date;
}

export interface DashboardMetrics {
  totalClients: number;
  totalLoanedAmount: number;
  totalOutstandingAmount: number;
  defaultRate: number; // in percentage
}

export interface MonthlyLoanData {
  month: string;
  totalLoans: number;
}

export interface PaymentStatusData {
  status: string;
  count: number;
  fill: string;
}
