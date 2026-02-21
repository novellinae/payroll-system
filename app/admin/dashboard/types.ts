export type PayrollStatus = "paid" | "processed" | "draft"
export type PayrollSummary = Partial<Record<PayrollStatus, number>>

export type AttendanceStatus = "present" | "absent" | "sick" | "leave"
export type AttendanceSummary = Record<AttendanceStatus, number>

export interface DashboardSummary {
  total_active_employees: number
  payroll_summary: {
    paid?: number
    processed?: number
    draft?: number
  }
  total_gross_salary: number
  attendance_summary: AttendanceSummary
  attendance_rate: number
}

export interface EmployeeMiniTable{
    id: string
    employee_id : string
    first_name: string
    last_name: string
    department: string | null
    status: string
    hire_date: string
}

