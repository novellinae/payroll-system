import { createSupabaseServer } from "@/lib/supabase/server"
import { Box, Grid, Paper, Typography } from "@mui/material"

export default async function EmployeeDashboard({
    userId,
}: {
    userId: string
}) {
    const supabase = await createSupabaseServer()

    const {data: employee} = await supabase
    .from("employees")
    .select("*")
    .eq("auth_user_id", userId)
    .single()
    
    const {data: payroll} = await supabase
    .from("payrolls")
    .select("*, employees(base_salary)")
    .eq("employee_id", employee?.id)
    .order("created_at", { ascending: false })
    .limit(1)
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

    return (
        <Box>
            <Typography variant= "h4" mb = {4}>
                Welcome, {employee?.first_name}
            </Typography>

            <Grid container spacing={3}>
                {/* Grid Position */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{p:3}}>
                        <Typography variant="subtitle1">
                            Position
                        </Typography>
                        <Typography variant="h6">
                            {employee?.position}
                        </Typography>
                    </Paper>
                </Grid>
                {/* Grid Department */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{p:3}}>
                        <Typography variant="subtitle1">
                            Department
                        </Typography>
                        <Typography variant="h6">
                            {employee?.department}
                        </Typography>
                    </Paper>
                </Grid>
                {/* Grid Base Salary  */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{p:3}}>
                        <Typography variant="subtitle1">
                            Latest Salary
                        </Typography>
                        <Typography variant="h6">
                            Rp{(payroll?.employees?.base_salary ?? employee?.base_salary ?? 0).toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}