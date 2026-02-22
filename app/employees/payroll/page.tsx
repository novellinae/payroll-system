import { createSupabaseServer } from "@/lib/supabase/server";
import { Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import Link from "next/link";

interface PayrollPeriod {
    month: number
    year: number
}

interface EmployeePayrollRow {
    id: string
    gross_salary: number
    net_salary: number
    bonus: number | null
    deduction: number | null
    status: string | null
    payroll_periods: PayrollPeriod | null
}

interface EmployeeRecord {
    id: string
}

export default async function EmployeePayrollPage() {
    const supabase = await createSupabaseServer()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("auth_user_id", user.id)
    .single<EmployeeRecord>()

    if (!employee) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} mb={3}>
                    My Payroll
                </Typography>
                <Typography color="text.secondary">Employee profile not found.</Typography>
            </Box>
        )
    }

    const { data: payrolls } = await supabase
    .from("payrolls")
    .select(`
      id,
            gross_salary,
            net_salary,
            bonus,
            deduction,
      status,
            payroll_periods:payrolls_period_id_fkey (
        month,
        year
      )
    `)
        .eq("employee_id", employee.id)
        .returns<EmployeePayrollRow[]>()
        .order("year", {
                foreignTable: "payroll_periods",
                ascending: true,
        })
        .order("month", {
                foreignTable: "payroll_periods",
                ascending: true,
        })

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                My Payroll
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell>Gross Salary</TableCell>
                        <TableCell>Bonus</TableCell>
                        <TableCell>Deduction</TableCell>
                        <TableCell>Net Salary</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {payrolls?.map((payroll) => (
                        <TableRow key={payroll.id}>
                            <TableCell>
                                {payroll.payroll_periods
                                    ? new Date(
                                        payroll.payroll_periods.year,
                                        payroll.payroll_periods.month - 1
                                    ).toLocaleString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })
                                    : "-"}
                            </TableCell>
                            <TableCell>{payroll.gross_salary}</TableCell>
                            <TableCell>{payroll.bonus ?? 0}</TableCell>
                            <TableCell>{payroll.deduction ?? 0}</TableCell>
                            <TableCell>{payroll.net_salary}</TableCell>
                            <TableCell>
                                <Chip
                                    label={payroll.status ?? "draft"}
                                    color={(payroll.status ?? "draft") === "paid" ? "success" : "warning"}
                                />
                            </TableCell>
                            <TableCell>
                                <Link href={`/employees/payroll/${payroll.id}`}>
                                    View Details
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
    </Box>
  )
}