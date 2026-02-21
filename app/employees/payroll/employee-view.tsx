import { createSupabaseServer } from "@/lib/supabase/server"
import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"

type Payroll = {
  id: string
  bonus: number | null
  deduction: number | null
  status: string
  employees: {
    base_salary: number
  } | null
  payroll_periods: {
    month: number
    year: number
  } | null
}


export default async function EmployeePayrolll({
    userId,
}: {
    userId: string
}) {
    const supabase = await createSupabaseServer()

    const {data: employee} = await supabase
    .from("employees")
    .select("id, base_salary")
    .eq("auth_user_id", userId)
    .single()

    const {data} = await supabase
    .from("payrolls")
    .select("*, employees(base_salary), payroll_periods:payrolls_period_id_fkey (month, year)")
    .eq("employee_id", employee?.id)
    .order("year", {
        foreignTable: "payroll_periods",
        ascending: true
    })
    .order("month", {
        foreignTable: "payroll_periods",
        ascending: true
    })

    console.log("Payroll Data:", data)


    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell>Base Salary</TableCell>
                    <TableCell>Bonus</TableCell>
                    <TableCell>Deduction</TableCell>
                    <TableCell>Total Salary</TableCell>
                    <TableCell>Status</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {data?.map((row: Payroll) =>(
                    <TableRow key={row.id}>
                        <TableCell>
                            {row.payroll_periods
                            ? new Date(
                                row.payroll_periods.year,
                                row.payroll_periods.month - 1
                            ).toLocaleString("en-US", {
                                month: "long",
                                year: "numeric",
                            })
                            : "-"}
                        </TableCell>
                        <TableCell>{row.employees?.base_salary}</TableCell>
                        <TableCell>{row.bonus}</TableCell>
                        <TableCell>{row.deduction}</TableCell>
                        <TableCell>{(row.employees?.base_salary ?? 0) + (row.bonus ?? 0) - (row.deduction ?? 0)}</TableCell>
                        <TableCell><Chip
                                label={row.status}
                                color={row.status === "paid" ? "success" : "warning"}
                            /></TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}