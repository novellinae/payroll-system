import { DashboardSummary } from "@/app/admin/dashboard/types";
import { Box, Card, Grid, Typography } from "@mui/material";
import AttendancePieChart from "./attendance-chart";


interface AttendanceSectionProps {
    data: DashboardSummary
}

export default function AttendanceSection({
    data,
}: AttendanceSectionProps) {
    const present = data.attendance_summary.present ?? 0
    const absent = data.attendance_summary.absent ?? 0
    
    return (
        <Card sx={{ borderRadius: 4, p:4}}>
            <Grid container spacing={4} alignItems={"center"}>
                <Grid size = {{xs: 12, md:5}}>
                    <Typography variant="h4" fontWeight={700}>
                        {data.attendance_rate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Attendance Rate This Month
                    </Typography>

                    <Box mt={3}>
                        <Typography variant="body2">
                            Present: {present}
                        </Typography>
                        <Typography variant="body2">
                            Absent: {absent}
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={{xs: 12, md: 7}} display={"flex"} justifyContent={"center"}>
                    <AttendancePieChart data={data.attendance_summary}/>
                </Grid>
            </Grid>
        </Card>
    )
}