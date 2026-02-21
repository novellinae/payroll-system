import { createSupabaseServer } from "@/lib/supabase/server"
import AdminDashboard from "./admin-dashboard"
import EmployeeDashboard from "./employee-dashboard"

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = user?.user_metadata?.role ?? "employee"

  if (role === "admin") {
    return <AdminDashboard />
  }

  if (!user) {
    return null
  }

  return <EmployeeDashboard userId={user.id} />
}
