"use client"

import type { Table } from "@tanstack/react-table"
import { PlusCircle, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onAddClient: () => void;
  filterColumn?: string; // e.g., "name" or "email"
  filterColumnPlaceholder?: string; // e.g., "Filtrar por nome..."
}

export function DataTableToolbar<TData>({
  table,
  onAddClient,
  filterColumn = "name", // Default filter column
  filterColumnPlaceholder = "Filtrar por nome..."
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
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            Limpar
            <XIcon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
         <Button size="sm" className="h-9" onClick={onAddClient}>
          <PlusCircle className="mr-2 size-4" />
          Adicionar Cliente
        </Button>
      </div>
    </div>
  )
}
