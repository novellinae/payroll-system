"use client"
"use no memo"

import { useEffect, useState } from "react";
import { columns, Payroll } from "./columns";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export type EmployeeOption = {
  id: string
  first_name: string
  last_name: string
}

export type PeriodOption = {
  id: string
  month: number
  year: number
}

export default function PayrollTable({
  data,
  total,
  page,
  pageSize,
  employees,
  periods,
}: {
  data: Payroll[]
  total: number
  page: number
  pageSize: number
  employees: EmployeeOption[]
  periods: PeriodOption[]
}) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchEmployee, setSearchEmployee] = useState("")
    const [selectedPeriod, setSelectedPeriod] = useState("")

    useEffect(() => {
        setSearchEmployee(searchParams.get("search") ?? "")
        setSelectedPeriod(searchParams.get("period") ?? "")
    }, [searchParams])

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value.trim()) {
            params.set(key,value)
        } else{
            params.delete(key)
        }

        params.set("page", "0")
        router.push(`/admin/payroll?${params.toString()}`)
        router.refresh()
    }

    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    

    
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        router.push(`/admin/payroll?${params.toString()}`)
    }

    const handleRowsChange = (newSize: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("pageSize", String(newSize))
        params.set("page", "0")
        router.push(`/admin/payroll?${params.toString()}`)
    }

    return (
        <Paper sx={{mt: 4, mb:4, p:2}}>
            <TableContainer>
                <Table>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell key={header.id}>
                                        {flexRender (
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}    
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
                                        {cell.column.columnDef.cell
                                            ? flexRender(cell.column.columnDef.cell, cell.getContext())
                                            : String(cell.getValue() ?? "")}
                                    </TableCell>
                                    ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mt={2}>
                <Stack direction={"row"} spacing={2}>
                    <TextField
                        label= "Search Employee"
                        variant="outlined"
                        sx={{minWidth: 220}}
                        placeholder={`Search from ${employees.length} employees`}
                        value={searchEmployee}
                        onChange={(e) => {
                            setSearchEmployee(e.target.value)
                            handleFilter("search", e.target.value)
                        }}
                    />

                    <TextField
                        select
                        label= "Periods"
                        variant="outlined"
                        sx={{minWidth: 180}}
                        value={selectedPeriod}
                        onChange={(e) => {
                            setSelectedPeriod(e.target.value)
                            handleFilter("period", e.target.value)
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {periods.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.month}/{p.year}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>

                <TablePagination 
                    component= "div"
                    count={total}
                    page={page}
                    rowsPerPage={pageSize}
                    sx={{
                        "& .MuiTablePagination-toolbar": {
                            paddingRight: 0,
                        },
                    }}
                    onPageChange={(_, newPage) =>
                        handlePageChange(newPage)
                    }
                    onRowsPerPageChange={(e) =>
                        handleRowsChange(Number(e.target.value))
                    }
                />
            </Stack>
        </Paper>
    )
}
