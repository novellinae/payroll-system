import { createSupabaseClient } from "../supabase/client"


export async function getPayrollData({
    page,
    limit,
    department,
    month,
    year,
    search,
}: {
    page: number
    limit: number
    department?: string
    month?: number
    year?: number
    search?: string
})  {
    const supabase = createSupabaseClient()

    let query = supabase
    .from("payrolls")
    .select(`
        id,
        net_salary,
        bonus,
        deduction,
        status,
        employees(
        id,
        first_name.
        last_name,
        department),
        payroll_periods(
        month,
        year)
        `, {count: "exact"})

    if (department){
        query = query.eq("employees.department", department)
    }

    if(month){
        query = query.eq("payroll_periods.month", month)
    }

    if(year){
        query = query.eq("payroll_periods.year", year)
    }

    if (search){
        query = query.ilike("employees.first_name", `%${search}%`)

    }

    const from = page * limit
    const to = from + limit - 1

    query = query.range(from, to)

    const {data, count, error} = await query

    if (error) throw error
    return{
        data,
        total:count
    }
}