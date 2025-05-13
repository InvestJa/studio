"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Client } from "@/types";
import { ClientActions } from "./client-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";

export const getClientColumns = (
  onEdit: (client: Client) => void,
  onView: (client: Client) => void
): ColumnDef<Client>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todas as linhas"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "phone",
     header: ({ column }) => <DataTableColumnHeader column={column} title="Telefone" />,
  },
  {
    accessorKey: "loanAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valor do Empréstimo" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("loanAmount"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "outstandingBalance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Saldo Pendente" />,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("outstandingBalance"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      
      // Example: color based on balance
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (amount === 0) badgeVariant = "default"; // Or accent, if using it for success
      else if (amount > 0 && amount < 1000) badgeVariant = "secondary";
      else badgeVariant = "outline"; // Default or destructive for high balances

      return <Badge variant={badgeVariant} className="text-right whitespace-nowrap">{formatted}</Badge>;
    },
  },
  {
    accessorKey: "registrationDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data de Cadastro" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("registrationDate"));
      return <span>{date.toLocaleDateString('pt-BR')}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ClientActions client={row.original} onEdit={onEdit} onView={onView} />,
  },
];
