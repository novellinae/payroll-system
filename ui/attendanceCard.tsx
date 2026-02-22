"use client"

import { clockIn, clockOut } from "@/app/employees/dashboard/action"
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material"
import { useTransition } from "react"


type Attendance = {
    check_in: string | null
    check_out: string | null
    status: string | null
}

function formatAttendanceTime(value: string | null) {
    if (!value) return "-"

    if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        return value.slice(0, 5)
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
        return value
    }

    return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function calculateHours(checkIn: string, checkOut: string){
    const start = new Date(`2000-01-01T${checkIn}`)
    const end = new Date(`2000-01-01T${checkOut}`)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return diff.toFixed(2)
}


export default function AttendanceCard({
    employeeId,
    attendance,
}: {
    employeeId: string
    attendance: Attendance | null
}) {
    const [isPending, startTransition] = useTransition()

    const handleClockIn = () => {
        startTransition(() => {
            clockIn(employeeId)
        })
    }
    const handleClockOut = () => {
        startTransition(() => {
            clockOut(employeeId)
        })
    }

    return (
        <Paper sx={{ p:4, borderRadius: 3}}>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={3}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                    Attendance Today
                </Typography>
                <Chip
                label = {attendance?.status ?? "Not Checked in"}
                color={
                    attendance?.status === "late"
                    ? "error"
                    : attendance?.status === "present"
                    ? "success"
                    : "default"
                }
                />
            </Box>

            <Stack spacing={1} mb={3}>
                <Typography>
                    Clock In: {formatAttendanceTime(attendance?.check_in ?? null)}
                </Typography>

                <Typography>
                    Clock Out: {formatAttendanceTime(attendance?.check_out ?? null)}
                </Typography>
            </Stack>

            {!attendance?.check_in && (
                <Button
                variant="contained"
                fullWidth
                onClick={handleClockIn}
                disabled={isPending}>
                    Clock In
                </Button>
            )}
            {attendance?.check_in && !attendance?.check_out &&(
                <Button
                variant="contained"
                fullWidth
                onClick={handleClockOut}
                disabled={isPending}>
                    Clock Out
                </Button>
            )}

            {attendance?.check_out && (
                <Button disabled fullWidth>
                    Completed Today
                </Button>
            )}

            {attendance?.check_in && attendance?.check_out && (
                <Typography mt={2}>
                    Total Hours: {calculateHours(
                        attendance.check_in,
                        attendance.check_out
                    )}
                </Typography>
            )}

        </Paper>
    )
}