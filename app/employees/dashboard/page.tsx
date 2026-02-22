import { createSupabaseServer } from "@/lib/supabase/server"
import EmployeeDashboard from "./employee-dashboard"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = user?.user_metadata?.role ?? "employee"

  if (role === "admin") {
    redirect("/admin/dashboard")
  }

  if (!user) {
    return null
  }

  return <EmployeeDashboard userId={user.id} />
}
