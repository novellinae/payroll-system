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

async function attachPayslipToPayroll({
    supabase,
    periodId,
    employeeId,
    payrollId,
    file,
}: {
    supabase: Awaited<ReturnType<typeof createSupabaseServer>>
    periodId: string
    employeeId: string
    payrollId: string
    file: File
}): Promise<string | null> {
    if (file.type !== "application/pdf") {
        return "Only PDF allowed"
    }

    const { data: period, error: periodError } = await supabase
        .from("payroll_periods")
        .select("month")
        .eq("id", periodId)
        .single()

    if (periodError || !period) {
        return periodError?.message ?? "Payroll period not found."
    }

    const filePath = `${employeeId}/${payrollId}.pdf`

    const { error: uploadError } = await supabase.storage
        .from("payslips")
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        return uploadError.message
    }

    const { error: payslipError } = await supabase
        .from("payslips")
        .insert({
            payroll_id: payrollId,
            file_path: filePath,
            month: period.month,
        })

    if (payslipError) {
        return payslipError.message
    }

    return null
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

    const submittedFile = formData.get("payslip")
    const file = submittedFile instanceof File && submittedFile.size > 0 ? submittedFile : null


    const {data: payroll, error} = await supabase.from("payrolls").insert({
        employee_id,
        period_id,
        bonus,
        deduction,
        tax,
        gross_salary,
        net_salary,
        status
    })
    .select()
    .single();

    if (error) {
        if (error.code === "23505" || error.message.includes("payrolls_employee_id_period_id_key")) {
            return { error: "Payroll for this employee and period already exists." }
        }
        return { error: error.message }
    }

    if (!payroll) {
        return { error: "Failed to create payroll record." }
    }

    if (file) {
        const payslipError = await attachPayslipToPayroll({
            supabase,
            periodId: period_id,
            employeeId: employee_id,
            payrollId: payroll.id,
            file,
        })

        if (payslipError) {
            return { error: payslipError }
        }
    }

    revalidatePath("/admin/payroll");
    redirect("/admin/payroll");
}

export async function updatePayroll(
  payrollId: string,
  formData: FormData
) {
  const supabase = await createSupabaseServer()

  const bonus = Number(formData.get("bonus") ?? 0)
  const deduction = Number(formData.get("deduction") ?? 0)
  const tax = Number(formData.get("tax") ?? 0)
  const gross_salary = Number(formData.get("gross_salary") ?? 0)
  const net_salary = gross_salary + bonus - deduction - tax

  const submittedStatus = formData.get("status")
  const status =
    typeof submittedStatus === "string" && submittedStatus.trim()
      ? submittedStatus
      : "draft"

  const file = formData.get("payslip") as File | null

  // 🔥 1️⃣ Update payroll dulu
  const { data: payroll, error } = await supabase
    .from("payrolls")
    .update({
      bonus,
      deduction,
      tax,
      gross_salary,
      net_salary,
      status,
    })
    .eq("id", payrollId)
    .select("id, employee_id, period_id")
    .single()

  if (error) throw new Error(error.message)

  if (file && file.size > 0) {

    if (file.type !== "application/pdf") {
      throw new Error("Only PDF allowed")
    }

    const filePath = `${payroll.employee_id}/${payroll.id}.pdf`

    const { error: uploadError } = await supabase.storage
      .from("payslips")
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw new Error(uploadError.message)

    // cek apakah record payslip sudah ada
    const { data: existing } = await supabase
      .from("payslips")
      .select("id")
      .eq("payroll_id", payroll.id)
      .single()

    if (!existing) {
            const { data: period, error: periodError } = await supabase
                .from("payroll_periods")
                .select("month")
                .eq("id", payroll.period_id)
                .single()

            if (periodError || !period) {
                throw new Error(periodError?.message ?? "Payroll period not found")
            }

      // insert kalau belum ada
      const { error: insertError } = await supabase
        .from("payslips")
        .insert({
          payroll_id: payroll.id,
          file_path: filePath,
                    month: period.month,
        })

      if (insertError) throw new Error(insertError.message)
    } else {
      // update metadata
      const { error: updateError } = await supabase
        .from("payslips")
        .update({ file_path: filePath })
        .eq("payroll_id", payroll.id)

      if (updateError) throw new Error(updateError.message)
    }
  }

  revalidatePath("/admin/payroll")
  redirect("/admin/payroll")
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

export async function getPayslipPreview(filePath: string) {
    const supabase = await createSupabaseServer()

    let normalizedPath = filePath.trim()

    try {
        normalizedPath = decodeURIComponent(normalizedPath)
    } catch {
    }

    normalizedPath = normalizedPath.replace(/^\/+/, "")
    normalizedPath = normalizedPath.replace(/^object\/payslips\//, "")
    normalizedPath = normalizedPath.replace(/^payslips\//, "")

    if (!normalizedPath) {
        return null
    }

    const {data, error} = await supabase.storage
        .from("payslips")
        .createSignedUrl(normalizedPath, 60)

    if (error) {
        if (error.message.toLowerCase().includes("object not found")) {
            return null
        }
        throw new Error(error.message)
    }

    return data.signedUrl ?? null
}