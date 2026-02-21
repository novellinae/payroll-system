import { PayrollStatus, PayrollSummary } from "@/app/admin/dashboard/types";
import { PieChart } from "@mui/x-charts";

interface PayrollStatusProps {data: PayrollSummary}


export default function PayrollStatusPie({
    data
}: PayrollStatusProps) {
    const formatted = Object.entries(data).map(
        ([key, value], index) => ({
            id: index,
            value: value ?? 0,
            label: key as PayrollStatus,
        })
    )

    return (
        <PieChart
            width={320}
            height={260}
            series={[
                {
                    data: formatted,
                    innerRadius: 60,
                    outerRadius: 100,
                }
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