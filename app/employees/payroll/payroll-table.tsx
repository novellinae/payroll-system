"use client"

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import Link from "next/link"

type PayrollPeriod = {
    month: number
    year: number
}

export type EmployeePayrollRow = {
    id: string
    gross_salary: number
    net_salary: number
    status: string | null
    payroll_periods: PayrollPeriod | null
}

const columnHelper = createColumnHelper<EmployeePayrollRow>()

const columns = [
    columnHelper.accessor("payroll_periods", {
        header: "Period",
        cell: (info) => {
            const period = info.getValue()
            if (!period) return "-"
            return new Date(period.year, period.month - 1).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
            })
        },
    }),
    columnHelper.accessor("gross_salary", {
        header: "Gross Salary",
    }),
    columnHelper.accessor("net_salary", {
        header: "Net Salary",
    }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const status = info.getValue() ?? "draft"
            return (
                <Chip
                    label={status}
                    color={status === "paid" ? "success" : "warning"}
                />
            )
        },
    }),
    columnHelper.display({
        id: "action",
        header: "Action",
        cell: (info) => (
            <Link href={`/employees/payroll/${info.row.original.id}`}>
                View Details
            </Link>
        ),
    }),
]

export default function PayrollTable({ data }: { data: EmployeePayrollRow[] }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Table>
            <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableCell key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>

            <TableBody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}