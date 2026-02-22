import { createSupabaseServer } from "@/lib/supabase/server"
import { Box, Typography } from "@mui/material"
import { notFound } from "next/navigation"
import EditPayrollForm from "./edit-payroll-form"

interface PayrollEmployee {
    first_name: string
    last_name: string
}

interface PayrollPeriod {
    month: number
    year: number
}

interface AdminPayrollDetail {
    gross_salary: number
    bonus: number | null
    deduction: number | null
    tax: number | null
    status: string | null
    employees: PayrollEmployee | null
    payroll_periods: PayrollPeriod | null
    payslips: {
        file_path: string | null
    }[] | null
}


export default async function EditPayrollPage({
    params,
}: {
    params: Promise<{id: string}>
}) {
    const { id } = await params
    const supabase = await createSupabaseServer()

    const {data: payroll} = await supabase
    .from("payrolls")
    .select("*, employees:payrolls_employee_id_fkey(first_name, last_name), payroll_periods:payrolls_period_id_fkey(month, year), payslips(file_path)")
    .eq("id", id)
    .single<AdminPayrollDetail>()

    if (!payroll) {
        notFound()
    }

    const employeeName = payroll.employees
        ? `${payroll.employees.first_name ?? ""} ${payroll.employees.last_name ?? ""}`.trim()
        : ""

    const periodLabel = payroll.payroll_periods
        ? `${payroll.payroll_periods.month}/${payroll.payroll_periods.year}`
        : "-"

    return(
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                    Update {employeeName || "Employee"} Payroll ({periodLabel})
                </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <EditPayrollForm
                    payrollId={id}
                    initialGrossSalary={payroll.gross_salary ?? 0}
                    initialBonus={payroll.bonus ?? 0}
                    initialDeduction={payroll.deduction ?? 0}
                    initialTax={payroll.tax ?? 0}
                    initialStatus={payroll.status ?? "draft"}
                    initialPayslipPath={payroll.payslips?.[0]?.file_path ?? null}
                />
            </Box>
        </Box>
    )
}