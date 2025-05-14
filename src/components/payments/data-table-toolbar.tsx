
"use client"

import type { Table } from "@tanstack/react-table"
import { PlusCircle, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/clients/data-table-view-options"; // Reusing
import type { Payment } from "@/types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onAddPayment: () => void;
  // Filter by client name or ID
  filterColumn?: string; 
  filterColumnPlaceholder?: string;
}

// Predefined statuses for the filter
const statuses: { value: Payment['status']; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
  { value: "Pago", label: "Pago", icon: Icons.success },
  { value: "Pendente", label: "Pendente", icon: Icons.mail }, // Placeholder, use a better icon
  { value: "Atrasado", label: "Atrasado", icon: Icons.warning },
  { value: "Falhou", label: "Falhou", icon: Icons.error },
];


export function PaymentDataTableToolbar<TData>({
  table,
  onAddPayment,
  filterColumn = "clientName", 
  filterColumnPlaceholder = "Filtrar por cliente..."
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={filterColumnPlaceholder}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="h-9 w-[150px] lg:w-[250px]"
        />
        {/* Add status filter if needed, similar to DataTableFacetedFilter in shadcn examples */}
        {/* For simplicity, leaving faceted filter out for now */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            Limpar Filtros
            <XIcon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
         <Button size="sm" className="h-9" onClick={onAddPayment}>
          <PlusCircle className="mr-2 size-4" />
          Adicionar Pagamento
        </Button>
      </div>
    </div>
  )
}
