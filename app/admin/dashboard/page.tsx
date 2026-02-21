import { createSupabaseServer } from "@/lib/supabase/server"
import { getDashboardData, getRecentEmployees } from "./action"

import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const now = new Date()
  
  const dashboardData = await getDashboardData(
      now.getMonth() + 1,
      now.getFullYear()
  )

  const recentEmployees = await getRecentEmployees()

  return (
    <DashboardClient 
      initialData={dashboardData}
      recentEmployees={recentEmployees}
    />
  )
}
