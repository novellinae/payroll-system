import { createSupabaseServer } from "@/lib/supabase/server"
import AttendanceCard from "@/ui/attendanceCard"
import { Box, Divider, Grid, Paper, Typography } from "@mui/material"

function formatCurrency(value: number){
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}
function calculateHours(checkIn: string, checkOut: string){
    const start = new Date(`2000-01-01T${checkIn}`)
    const end = new Date(`2000-01-01T${checkOut}`)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return diff.toFixed(2)
}


export default async function EmployeeDashboard({
    userId,
}: {
    userId: string
}) {
    const supabase = await createSupabaseServer()

    const {data: employee} = await supabase
    .from("employees")
    .select("id, first_name, last_name, department, position, base_salary, status")
    .eq("auth_user_id", userId)
    .single()
    
    const {data: payroll} = await supabase
    .from("payrolls")
    .select(`*`)
    .eq("employee_id", employee?.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

    const today = new Date().toISOString().split("T")[0]
    const {data: attendance} = await supabase
    .from("attendance")
    .select("check_in, check_out, status")
    .eq("employee_id", employee?.id)
    .eq("attendance_date", today)
    .single()



    if (!employee) {
        return (
            <Box>
            <Typography variant="h5">
                Your employee profile is not set up yet.
            </Typography>
            <Typography variant="body1" mt={2}>
                Please contact HR to activate your account.
            </Typography>
            </Box>
        )
    }
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)


    return (
        <Box sx={{px: 6, py: 3, mx: "auto", maxWidth: 1400,
            minHeight:"100vh"
        }}>
            <Box mb={2}>
                <Typography variant= "h4" fontWeight={600} mb = {4}>
                    Welcome, {employee?.first_name} 👋
                </Typography>
                <Typography color="text.secondary">
                    Here is your employment and payroll overview.
                </Typography>
            </Box>
            

            <Grid container spacing={4}>
                {/* Left Section */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box display={"flex"} flexDirection={"column"} gap={4}>
                        <AttendanceCard 
                            employeeId={employee.id}
                            attendance={attendance}
                        />
                        <Grid container spacing={3} mb={1}>
                            <Grid size={{xs:12, md:6}}>
                                <Paper sx={{p:3, borderRadius: 3}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Attendance This Month
                                    </Typography>
                                    <Typography variant="h5" fontWeight={600}>
                                        16 days
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid size={{xs:12, md:6}}>
                                <Paper sx={{p:3, borderRadius: 3}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Working Hours (Today)
                                    </Typography>
                                    <Typography variant="h5" fontWeight={600}>
                                        {attendance?.check_in && attendance?.check_out
                                            ? `${calculateHours(
                                                attendance.check_in,
                                                attendance.check_out
                                                )} hours`
                                            : "0 hours"}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* Right Section */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{p:4, borderRadius: 3}}>
                        <Typography variant="h6" fontWeight={600} mb={3}>
                            Quick Info
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Employee Name
                        </Typography>
                        <Typography variant="subtitle1" mb={2}>
                            {employee.first_name} {employee.last_name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Curent Status
                        </Typography>
                        <Typography variant="subtitle1">
                            {employee.status}
                        </Typography>
                    </Paper>
                    <Paper sx={{p:4, borderRadius: 3, mt: 4}}>
                            <Typography variant="h6" fontWeight={600} mb={3}>
                                Employment Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid size={{xs:12, md: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Position
                                    </Typography>
                                    <Typography variant="h6">
                                        {employee.position}
                                    </Typography>
                                </Grid>

                                <Grid size={{xs:12, md: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Department
                                    </Typography>
                                    <Typography variant="h6">
                                        {employee.department}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>                        

                </Grid>

                <Grid size={{xs: 12}}>
                    <Paper sx={{p:4, borderRadius: 3, mt:1}}>
                        <Typography variant="h6" fontWeight={600} mb={3}>
                            Latest Payroll
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Base Salary
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                            {formatCurrency(
                                payroll?.net_sallary ??
                                employee.base_salary ??
                                0
                            )}
                        </Typography>

                        <Divider sx={{ my: 3}} />

                        <Typography variant="body2" color="text.secondary">
                            Status
                        </Typography>
                        <Typography variant="subtitle1" >
                            {payroll?.status ?? "Not Generated Yet"}
                        </Typography>
                    </Paper>
                </Grid>

                

            </Grid>
        </Box>
    )
}