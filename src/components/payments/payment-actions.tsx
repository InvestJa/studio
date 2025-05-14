
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import type { Payment } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PaymentActionsProps {
  payment: Payment;
  onEdit: (payment: Payment) => void;
  onView: (payment: Payment) => void;
  onUpdateStatus: (payment: Payment, status: Payment['status']) => void;
}

export function PaymentActions({ payment, onEdit, onView, onUpdateStatus }: PaymentActionsProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    toast({
      title: `Pagamento de ${payment.clientName} excluído (simulado)`,
      description: "Esta funcionalidade ainda não está implementada.",
      variant: "default"
    });
  };

  const paymentStatuses: Payment['status'][] = ['Pago', 'Pendente', 'Atrasado', 'Falhou'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <Icons.moreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações do Pagamento</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(payment)}>
          <Icons.view className="mr-2 h-4 w-4" />
          Visualizar Detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(payment)}>
          <Icons.edit className="mr-2 h-4 w-4" />
          Editar Pagamento
        </DropdownMenuItem>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icons.settings className="mr-2 h-4 w-4" />
            Atualizar Status
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {paymentStatuses.map(status => (
                <DropdownMenuItem 
                  key={status} 
                  onClick={() => onUpdateStatus(payment, status)}
                  disabled={payment.status === status}
                >
                  Marcar como {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          <Icons.delete className="mr-2 h-4 w-4" />
          Excluir Pagamento
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
