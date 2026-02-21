import { DashboardSummary } from "@/app/admin/dashboard/types"
import { Box, Card, Grid, Typography } from "@mui/material"
import PayrollStatusPie from "./payroll-chart"

interface PayrollSectionProps {
    data: DashboardSummary
}

export default function PayrollSection({
    data,
}: PayrollSectionProps) {
    const paid = data.payroll_summary.paid ?? 0
    const processed = data.payroll_summary.processed ?? 0
    const draft = data.payroll_summary.draft ?? 0

    const total = paid + processed + draft

    const paidRate =
        total === 0 ? 0 : Math.round((paid/total) * 100)

    return (
        <Card sx={{ borderRadius: 4, p:4}}>
            <Grid container spacing={4} alignItems={"center"}>
                {/* Left Insight */}
                <Grid size={{xs: 12, md:5}}>
                    <Typography variant="h4" fontWeight={700}>
                        {paidRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Payroll Completed
                    </Typography>

                    <Box mt={3}>
                        <Typography>Paid: {paid}</Typography>
                        <Typography>Processed: {processed}</Typography>
                        <Typography>Draft: {draft}</Typography>
                    </Box>
                </Grid>

                <Grid size={{xs: 12, md:7}} display="flex" justifyContent={"center"}>
                    <PayrollStatusPie data={data.payroll_summary}/>
                </Grid>
                
            </Grid>
        </Card>
    )
}