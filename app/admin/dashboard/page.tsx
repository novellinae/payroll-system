import { getDashboardData, getRecentEmployees } from "./action"

import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const now = new Date()
  const initialMonth = now.getMonth() + 1
  const initialYear = now.getFullYear()
  
  const dashboardData = await getDashboardData(
      initialMonth,
      initialYear
  )

  const recentEmployees = await getRecentEmployees()


  return (
    <DashboardClient 
      initialData={dashboardData}
      recentEmployees={recentEmployees}
      initialMonth={initialMonth}
      initialYear={initialYear}
    />
  )
}
