"use client"

import { useEffect, useState } from "react"
import { getDashboardData } from "./action"
import { Box, Grid, Typography } from "@mui/material"
import MonthSelector from "@/ui/monthselector"
import { DashboardSummary, EmployeeMiniTable } from "./types"
import InsightCard from "@/ui/kpicard"
import PayrollSection from "@/ui/payroll-adm-section"
import AttendanceSection from "@/ui/attendance-adm-section"
import RecentEmployeesTable from "@/ui/mini-emp-table"

interface DashboardClientProps {
    initialData: DashboardSummary
    recentEmployees: EmployeeMiniTable[]
    initialMonth: number
    initialYear: number
}


export default function DashboardClient({
    initialData,
    recentEmployees,
    initialMonth,
    initialYear,
}: DashboardClientProps) {
    const [month, setMonth] = useState(initialMonth)
    const [year] = useState(initialYear)
    const [data, setData] = useState<DashboardSummary>(initialData)


    useEffect(() =>{
        async function fetchData() {
            const newData = await getDashboardData(month, year)
            setData(newData)
        }

        fetchData()
    }, [month, year])

    return (
        <Box maxWidth={"1400px"} mx={"auto"} px={4} py={4}>
            <Box display="flex" justifyContent= "space-between" mb={3} alignItems= "center">
                <Typography variant="h4" fontWeight={600}>
                    Admin Dashboard
                </Typography>
                <MonthSelector month={month} onChange={setMonth}/>
            </Box>

            {/* KPI GRID */}
            <Grid container spacing={3} mb={4}>
                <Grid size= {{xs: 12, md: 4}}>
                    <InsightCard 
                        title= "Active Employees"
                        value={data?.total_active_employees ?? 0}
                        subtitle="This Month"
                    />
                </Grid>

                <Grid size= {{xs: 12, md: 4}}>
                    <InsightCard 
                        title= "Paid Payrolls"
                        value={data?.payroll_summary?.paid ?? 0}
                        subtitle="This month"
                    />
                </Grid>

                <Grid size= {{xs: 12, md: 4}}>
                    <InsightCard 
                        title= "Gross Salary"
                        value={`Rp ${data?.total_gross_salary.toLocaleString("id-ID")}`}
                        subtitle="This Month"
                    />
                </Grid>
            </Grid>


            <Grid container spacing={4} mb={4}>
                <Grid size= {{xs: 12, md: 6}}>
                    <PayrollSection data={data} />
                </Grid>

                <Grid size= {{xs: 12, md: 6}}>
                    <AttendanceSection data={data} />
                </Grid>
            </Grid>
            <Box mt={4}>
                <RecentEmployeesTable data={recentEmployees} />
            </Box>
            
        </Box>
    )
}