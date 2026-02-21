import { ColumnDef } from "@tanstack/react-table";

type Employee = {
    employees: {
        first_name: string
        department: string
    }
    payroll_periods:{
        month: string
    }
}

export const columns: ColumnDef<Employee>[] = [
    {
        header: "Employee",
        accessorFn: row => row.employees.first_name
    },
    {
        header: "Department",
        accessorFn: row => row.employees.department
    },
    {
        header: "Month",
        accessorFn: row => row.payroll_periods.month
    },
    {
        header: "Net Salary",
        accessorKey: "net_salary"
    },
    {
        header: "Status",
        accessorKey: "status"
    }
]