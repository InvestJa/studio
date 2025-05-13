"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Client, Payment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icons } from "../icons";

interface ViewClientDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  client: Client | null;
}

export function ViewClientDialog({ isOpen, onOpenChange, client }: ViewClientDialogProps) {
  if (!client) return null;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('pt-BR');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente: {client.name}</DialogTitle>
          <DialogDescription>
            Informações completas e histórico de pagamentos do cliente.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-150px)] pr-5"> {/* Adjust height as needed */}
          <div className="space-y-6 py-4">
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><strong className="text-muted-foreground">Nome:</strong> {client.name}</div>
                <div><strong className="text-muted-foreground">Email:</strong> {client.email}</div>
                <div><strong className="text-muted-foreground">Telefone:</strong> {client.phone}</div>
                <div><strong className="text-muted-foreground">Documento:</strong> {client.document}</div>
                <div><strong className="text-muted-foreground">Data de Cadastro:</strong> {formatDate(client.registrationDate)}</div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Detalhes do Empréstimo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><strong className="text-muted-foreground">Valor Emprestado:</strong> {formatCurrency(client.loanAmount)}</div>
                <div><strong className="text-muted-foreground">Prazo:</strong> {client.loanTerm} meses</div>
                <div><strong className="text-muted-foreground">Taxa de Juros:</strong> {client.interestRate}% a.m.</div>
                <div><strong className="text-muted-foreground">Saldo Pendente:</strong> <Badge variant={client.outstandingBalance === 0 ? "default" : "destructive"}>{formatCurrency(client.outstandingBalance)}</Badge></div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Histórico de Pagamentos</h3>
              {client.paymentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          <Badge variant={
                            payment.status === 'Pago' ? 'default' : 
                            payment.status === 'Pendente' ? 'secondary' : 
                            'destructive'
                          }>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum pagamento registrado.</p>
              )}
            </section>
          </div>
        </ScrollArea>
        <div className="pt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
