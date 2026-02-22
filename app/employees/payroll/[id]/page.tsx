import { createSupabaseServer } from "@/lib/supabase/server"
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material"
import { notFound } from "next/navigation"

interface PayrollPeriod {
    month: number
    year: number
}

interface PayrollDetail {
    gross_salary: number
    net_salary: number
    bonus: number | null
    deduction: number | null
    tax: number | null
    payroll_periods: PayrollPeriod | null
}

interface EmployeeRecord {
    id: string
}


function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

export default async function EmployeePayrollDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return notFound()

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("auth_user_id", user.id)
    .single<EmployeeRecord>()

  if (!employee) return notFound()

  const { data: payroll } = await supabase
    .from("payrolls")
    .select(
      `
        id,
        gross_salary,
        net_salary,
        bonus,
        deduction,
        tax,
        status,
        payroll_periods:payrolls_period_id_fkey (
          month,
          year
        )
      `
    )
    .eq("id", id)
    .eq("employee_id", employee.id)
    .eq("status", "paid")
    .single<PayrollDetail & { status?: string | null }>()

  if (!payroll) return notFound()

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Payroll Detail
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Typography fontWeight={600}>
            Period: {payroll.payroll_periods
              ? `${payroll.payroll_periods.month}/${payroll.payroll_periods.year}`
              : "-"}
          </Typography>

          <Chip
            label={payroll.status ?? "draft"}
            color={(payroll.status ?? "draft") === "paid" ? "success" : "warning"}
            sx={{ textTransform: "capitalize" }}
          />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Earnings & Deductions */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight={600} mb={2}>
              Earnings
            </Typography>

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Gross Salary</Typography>
                <Typography>{formatCurrency(payroll.gross_salary)}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography>Bonus</Typography>
                <Typography>{formatCurrency(payroll.bonus ?? 0)}</Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight={600} mb={2}>
              Deductions
            </Typography>

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Tax</Typography>
                <Typography color="error">
                  - {formatCurrency(payroll.tax ?? 0)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography>Other Deduction</Typography>
                <Typography color="error">
                  - {formatCurrency(payroll.deduction ?? 0)}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Net Salary Highlight */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={600}>
            Take Home Pay
          </Typography>

          <Typography
            variant="h4"
            fontWeight={600}
            color="primary"
          >
            {formatCurrency(payroll.net_salary)}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}