"use server"

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";



export async function clockIn(employeeId: string) {
    const supabase = await createSupabaseServer()

    const today = new Date().toISOString().split("T")[0]
    const timeNow = new Date().toTimeString().split(" ")[0]

    const shiftStartHour = 9
    const currentHour = new Date().getHours()

    const status = currentHour > shiftStartHour ? "late" : "present"
    const {error} = await supabase
    .from("attendance")
    .upsert({
        employee_id: employeeId,
        attendance_date : today,
        check_in: timeNow,
        status,
    },
    { onConflict: "employee_id, attendance_date"}
)

    if (error) throw new Error(error.message)

    revalidatePath("/employees/dashboard")
}


export async function clockOut(employeeId: string) {
    const supabase = await createSupabaseServer()

    const today = new Date().toISOString().split("T")[0]
    const timeNow = new Date().toTimeString().split(" ")[0]


    const {error} = await supabase
    .from("attendance")
    .update({
        check_out: timeNow,
    })
    .eq("employee_id", employeeId)
    .eq("attendance_date", today)

    if (error) throw new Error(error.message)

    revalidatePath("/employees/dashboard")
}