import { createSupabaseServer } from "@/lib/supabase/server";
import { Box, Typography } from "@mui/material";
import PayrollTable from "./payroll-table";

interface EmployeeRecord {
    id: string
}

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
    payslips: {
        file_path: string | null
    }[] | null
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
                <Typography variant="h5" fontWeight={600} mb={3}>
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
                payslips (
                    file_path
                ),
        payroll_periods:payrolls_period_id_fkey (
        month,
        year
      )
    `)
    .eq("employee_id", employee.id)
    .eq("status", "paid")
    .returns<EmployeePayrollRow[]>()
    .order("created_at", { ascending: false })

    const payrollRows: EmployeePayrollRow[] = (payrolls ?? []).map((row) => ({
        ...row,
        payslips:
            row.payslips && row.payslips.length > 0
                ? row.payslips
                : [{ file_path: `${employee.id}/${row.id}.pdf` }],
    }))


    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
                My Payroll
            </Typography>
            <PayrollTable data={payrollRows} />
    </Box>
  )
}