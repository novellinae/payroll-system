"use server"

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreatePayrollState = {
    error: string | null
}

export type CreatePayrollPeriodState = {
    error: string | null
}



export async function createPayroll(_: CreatePayrollState, formData:FormData): Promise<CreatePayrollState> {
    const supabase = await createSupabaseServer()

    const employee_id = formData.get("employee_id") as string;
    const period_id = formData.get("period_id") as string;
    const bonus = Number(formData.get("bonus"));
    const deduction = Number(formData.get("deduction"));
    const tax = Number(formData.get("tax"));
    const gross_salary = Number(formData.get("gross_salary"));
    const net_salary = gross_salary + bonus - deduction - tax;
    const submittedStatus = formData.get("status")
    const status = typeof submittedStatus === "string" ? submittedStatus : "draft"

    const {error} = await supabase.from("payrolls").insert({
        employee_id,
        period_id,
        bonus,
        deduction,
        tax,
        gross_salary,
        net_salary,
        status
    });

    if (error) {
        if (error.code === "23505" || error.message.includes("payrolls_employee_id_period_id_key")) {
            return { error: "Payroll for this employee and period already exists." }
        }
        return { error: error.message }
    }

    revalidatePath("/admin/payroll");
    redirect("/admin/payroll");
}

export async function updatePayroll(payrollId:string, formData:FormData) {
    const supabase = await createSupabaseServer();

    const bonus = Number(formData.get("bonus") ?? 0)
    const deduction = Number(formData.get("deduction") ?? 0)
    const tax = Number(formData.get("tax") ?? 0)
    const gross_salary = Number(formData.get("gross_salary") ?? 0)
    const net_salary = gross_salary + bonus - deduction - tax
    const submittedStatus = formData.get("status")
    const status = typeof submittedStatus === "string" && submittedStatus.trim() ? submittedStatus : "draft"

    const {error} = await supabase
    .from("payrolls")
    .update({
        bonus,
        deduction,
        tax,
        gross_salary,
        net_salary,
        status,
    })
    .eq("id", payrollId);
    
    if (error) throw new Error(error.message);

    revalidatePath("/admin/payroll");
    redirect("/admin/payroll");
}

export async function deletePayroll(id:string) {
    const supabase = await createSupabaseServer();

    const {error} = await supabase
    .from("payrolls")
    .delete()
    .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/payroll");
}

export async function createPayrollPeriod(
    _: CreatePayrollPeriodState,
    formData: FormData
): Promise<CreatePayrollPeriodState> {
    const supabase = await createSupabaseServer()

    const month = Number(formData.get("month") ?? 0)
    const year = Number(formData.get("year") ?? 0)

    const { error } = await supabase
        .from("payroll_periods")
        .insert({ month, year })

    if (error) {
        if (error.code === "23505") {
            return { error: "Payroll period already exists." }
        }
        return { error: error.message }
    }

    revalidatePath("/admin/payroll")
    revalidatePath("/admin/payroll/create")
    return { error: null }
}