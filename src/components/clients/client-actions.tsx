"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import type { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ClientActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
  // onDelete would typically call a server action or API
}

export function ClientActions({ client, onEdit, onView }: ClientActionsProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    // In a real app, this would trigger a confirmation dialog and then a server action
    toast({
      title: `Cliente ${client.name} excluído (simulado)`,
      description: "Esta funcionalidade ainda não está implementada.",
      variant: "default"
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <Icons.moreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(client)}>
          <Icons.view className="mr-2 h-4 w-4" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(client)}>
          <Icons.edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          <Icons.delete className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
