import { createSupabaseServer } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

type Payroll = {
    id: string,
    base_salary: number,
    bonus: number,
    deduction: number,
    employees: Array<{
        first_name: string,
        last_name: string
    }>
}
export default async function AdminPayroll() {
    const supabase = await createSupabaseServer()

    const {data} = await supabase
    .from("payrolls") 
    .select(`
        id,
        base_salary,
        bonus,
        deduction,
        employees(first_name, last_name)`)
    
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Base Salary</TableCell>
                    <TableCell>Bonus</TableCell>
                    <TableCell>Deduction</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {data?.map((row: Payroll) => (
                    <TableRow key={row.id}>
                        <TableCell>
                            {row.employees?.[0]?.first_name} {row.employees?.[0]?.last_name}
                        </TableCell>
                        <TableCell>{row.base_salary}</TableCell>
                        <TableCell>{row.bonus}</TableCell>
                        <TableCell>{row.deduction}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
}