"use client"

import { createPayrollPeriod } from "../action"
import { Button, TextField } from "@mui/material"
import { useActionState, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export default function CreatePayrollPeriodForm({
  onSuccess,
}: {
  onSuccess?: () => void
}) {
  const currentDate = new Date()
  const router = useRouter()
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1))
  const [year, setYear] = useState(String(currentDate.getFullYear()))
  const submittedRef = useRef(false)

  const [state, formAction] = useActionState(createPayrollPeriod, { error: null })

  useEffect(() => {
    if (!submittedRef.current) {
      return
    }

    if (state.error) {
      alert(state.error)
      submittedRef.current = false
      return
    }

    alert("Payroll period created.")
    router.refresh()
    onSuccess?.()
    submittedRef.current = false
  }, [state, router, onSuccess])

  return (
    <form
      action={formAction}
      onSubmit={() => {
        submittedRef.current = true
      }}
      style={{
        width: "100%",
        maxWidth: 640,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <TextField
        name="month"
        type="number"
        label="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        inputProps={{ min: 1, max: 12 }}
        required
      />

      <TextField
        name="year"
        type="number"
        label="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />

      <Button type="submit" variant="contained">
        Create Payroll Period
      </Button>
    </form>
  )
}
