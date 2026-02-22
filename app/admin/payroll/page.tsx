export const dynamic = "force-dynamic"
import { createSupabaseServer } from "@/lib/supabase/server";
import PayrollTable from "./payroll-table";
import { Payroll } from "./columns";
import { Box, Button, Stack, Typography } from "@mui/material";

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


export default async function PayrollAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    period?: string
    employee?: string
    page?: string
    pageSize?: string
  }>
}) {
  const params = await searchParams
  const supabase = await createSupabaseServer()

  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .order("first_name", { ascending: true })
    .returns<EmployeeOption[]>()

  const { data: periods } = await supabase
    .from("payroll_periods")
    .select("id, month, year")
    .order("year", { ascending: false })
    .returns<PeriodOption[]>()
    
    const page = Number(params.page ?? 0)
    const pageSize = Number(params.pageSize ?? 5)

    const from = page * pageSize
    const to = from + pageSize - 1

    const baseQuery = supabase.from("payrolls")



  let query = baseQuery
    .select(`
      id,
      employee_id,
      period_id,
      bonus,
      deduction,
      tax,
      gross_salary,
      net_salary,
      status,
      created_at,
      employees!inner (
        id,
        first_name,
        last_name,
        department
      ),
      payroll_periods (
        id,
        month,
        year
      ),
      payslips (
        file_path
      )
    `, {count: "exact"})

    

    if (params.search?.trim()) {
      const searchTerm = params.search.trim()
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`,
        { foreignTable: "employees" }
      )
    }

    if (params.employee) {
      query = query.eq("employee_id", params.employee)
    }

    if (params.period) {
      query = query.eq("period_id", params.period)
    }

    const { data, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to)
      .returns<Payroll[]>()

  return (
    <Box sx={{ px: 4, py: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Typography variant="h4" fontWeight={600}>
          Payroll Data
        </Typography>

        <Button variant="contained" href="/admin/payroll/create">
          Create Payroll
        </Button>
      </Stack>

      <Box sx={{ width: "100%", }}>
        <PayrollTable
          data={data ?? []}
          total={count ?? 0}
          page={page}
          pageSize={pageSize}
          employees={employees ?? []}
          periods={periods ?? []}
        />
      </Box>
    </Box>
  )
}