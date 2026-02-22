
"use client"

import Link from "next/link";
import { Box, IconButton } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deletePayroll } from "./action";



export type Payroll = {
    id: string
    bonus: number
    deduction: number
    tax: number
    gross_salary : number
    net_salary: number
    status: string
    employees : {
        first_name: string
        last_name: string
        department: string
    };
    payroll_periods: {
        month: number
        year: number
    };
};


export const columns: ColumnDef<Payroll>[] = [
    {
        header: "Employee",
        accessorFn: (row) =>
            `${row.employees.first_name} ${row.employees.last_name}`,
    },
    {
        header: "Department",
        accessorFn: (row) => row.employees.department,
    },
    {
        header: "Period",
        accessorFn: (row) =>
            `${row.payroll_periods.month}/${row.payroll_periods.year}`,
    },
    {
        header: "Gross",
        accessorKey: "gross_salary"
    },
    {
        header: "Net",
        accessorKey: "net_salary",
    },
    {
        header: "Status",
        accessorKey: "status",
    },
    {
        header: "Actions",
        cell: ({row}) => {
            const id = row.original.id
            const isPaid = row.original.status === "paid"
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                        LinkComponent={Link}
                        href={`/admin/payroll/${id}`}
                    >
                        <EditIcon />
                    </IconButton>
                    
                    <form action={deletePayroll.bind(null, id)} style={{ display: "inline-flex" }} onSubmit={(e) => {
                        if (isPaid) {
                            e.preventDefault()
                            return
                        }
                        if (!confirm("Are you sure?")){
                            e.preventDefault()
                        }
                    }}>
                        <IconButton color="error" type="submit" disabled={isPaid}>
                            <DeleteIcon />
                        </IconButton>
                    </form>
                </Box>
            )
        }
    },
    
]