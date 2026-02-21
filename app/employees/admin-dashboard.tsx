import { Box, Typography, Grid, Paper } from "@mui/material"

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" textAlign="center">
              Total Employees
            </Typography>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              5
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" textAlign="center">
              Total Payroll
            </Typography>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              Rp 52.000.000
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" textAlign="center">
              Active Employees
            </Typography>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              4
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
