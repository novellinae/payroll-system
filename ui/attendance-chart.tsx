"use client"
import { AttendanceSummary } from "@/app/admin/dashboard/types"
import { PieChart } from "@mui/x-charts"


interface AttendancePieChartProps {
  data: AttendanceSummary
}

export default function AttendancePieChart({
    data,
}: AttendancePieChartProps) {
    const formatted = Object.entries(data).map(
        ([key, value], index) => ({
            id: index,
            value,
            label: key,
        })
    )
    
    return(
        <PieChart
            width={320}
            height = {260}
            series={[
                {
                    data: formatted,
                    innerRadius: 60,
                    outerRadius: 100,
                },
            ]}
             slotProps={{
                legend: {
                    direction: "horizontal",
                    position: {
                        vertical: "bottom",
                        horizontal: "center",
                    },
                },
            }}
        />
    )
}