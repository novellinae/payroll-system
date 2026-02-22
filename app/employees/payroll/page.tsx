import { createSupabaseServer } from "@/lib/supabase/server";
import { Box, Typography } from "@mui/material";
import PayrollTable, { type EmployeePayrollRow } from "./payroll-table";

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
      status,
            payroll_periods:payrolls_period_id_fkey (
        month,
        year
      )
    `)
        .eq("employee_id", employee.id)
    .eq("status", "paid")
        .returns<EmployeePayrollRow[]>()
    .order("created_at", { ascending: false })

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                My Payroll
            </Typography>

            <PayrollTable data={payrolls ?? []} />
    </Box>
  )
}