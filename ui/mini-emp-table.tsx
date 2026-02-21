"use client"

import { EmployeeMiniTable } from "@/app/admin/dashboard/types"
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"


const columnHelper = createColumnHelper<EmployeeMiniTable>()

const columns = [
    columnHelper.accessor("employee_id", {
        header: "ID"
    }),

    columnHelper.accessor(
        row => `${row.first_name} ${row.last_name}`,
        {
            id: "name",
            header: "Name",
        }
    ),

    columnHelper.accessor("department", {
        header: "Department",
        cell: info => info.getValue() ?? "-"
    }),
    
    columnHelper.accessor("status", {
        header: "Status",
        cell: info => (
            <Typography
            variant="caption"
            sx={{
                px:1.5,
                py: 0.5,
                borderRadius: 2,
                bgcolor:
                    info.getValue() === "active"
                        ? "success.light"  
                        : "grey.300"  
            }}>
                {info.getValue()}
            </Typography>
        )
    }),
]

export default function RecentEmployeesTable({
    data,
}: {data: EmployeeMiniTable[]
}) {
    const router = useRouter()
    const table = useReactTable<EmployeeMiniTable>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return(
        <Paper sx={{p:3, borderRadius: 4, mt:4}}>
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h6" fontWeight={600}>
                Recent Employees
                </Typography>

                <Button
                size="small"
                variant="text"
                onClick={() => router.push("/admin/employee")}
                sx={{
                    textTransform: "none",
                    fontWeight: 500,
                }}
                endIcon={<ArrowForwardIcon fontSize="small" />}
                >
                View All
                </Button>
            </Box>

            {/* Table */}
            <Table size="small">
                <TableHead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableCell key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>

                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                    )}
                                </TableCell>                            
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>             
        </Paper>
    )
}