"use server"

import { createSupabaseServer } from "@/lib/supabase/server"
import { DashboardSummary, EmployeeMiniTable } from "./types"


export async function getDashboardData(month:number, year:number) {
    const supabase = await createSupabaseServer()

    const {data, error} = await supabase.rpc(
        "get_admin_dash_summary",
        {
            p_month: month,
            p_year: year,
        }
    )

    if (error){
        throw new Error(error.message)
    }

    return data as DashboardSummary
}


export async function getRecentEmployees(): Promise<EmployeeMiniTable[]>{
    const supabase = await createSupabaseServer()

    const {data, error} = await supabase
    .from("employees")
    .select("id, employee_id, first_name, last_name, department, status, hire_date")
    .order("created_at", {ascending: false})
    .limit(5)

    if (error) throw new Error(error.message)

    return data as EmployeeMiniTable[]
}

