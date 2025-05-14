
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Payment } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ViewPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  payment: Payment | null;
}

export function ViewPaymentDialog({ isOpen, onOpenChange, payment }: ViewPaymentDialogProps) {
  if (!payment) return null;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  
  let statusBadgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
  if (payment.status === 'Pago') statusBadgeVariant = 'default';
  else if (payment.status === 'Pendente') statusBadgeVariant = 'secondary';
  else if (payment.status === 'Atrasado' || payment.status === 'Falhou') statusBadgeVariant = 'destructive';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
          <DialogDescription>
            ID do Pagamento: {payment.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-semibold text-muted-foreground">Cliente:</h4>
            <p className="text-foreground">{payment.clientName}</p>
          </div>
          <div>
            <h4 className="font-semibold text-muted-foreground">Data do Pagamento:</h4>
            <p className="text-foreground">{formatDate(payment.date)}</p>
          </div>
          <div>
            <h4 className="font-semibold text-muted-foreground">Valor:</h4>
            <p className="text-foreground">{formatCurrency(payment.amount)}</p>
          </div>
          <div>
            <h4 className="font-semibold text-muted-foreground">Método:</h4>
            <p className="text-foreground">{payment.method}</p>
          </div>
          <div>
            <h4 className="font-semibold text-muted-foreground">Status:</h4>
            <Badge variant={statusBadgeVariant} className="capitalize">{payment.status}</Badge>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
