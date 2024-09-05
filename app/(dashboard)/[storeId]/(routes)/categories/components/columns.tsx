"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CategoryColumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "billboard",
    header: "Baner",
    cell: ({row}) => row.original.billboardLabel
  },
  {
    accessorKey: "subcategories",
    header: "Subcategorias",
  },
  {
    accessorKey: "createdAt",
    header: "Creación",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>
  }
]

