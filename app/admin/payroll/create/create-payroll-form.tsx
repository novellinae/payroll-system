"use client"

import { createPayroll } from "../action"
import AddIcon from "@mui/icons-material/Add"
import { Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField } from "@mui/material"
import { useActionState, useEffect, useMemo, useState } from "react"
import CreatePayrollPeriodForm from "./create-payroll-period-form"

type EmployeeOption = {
  id: string
  first_name: string
  last_name: string
}

type PeriodOption = {
  id: string
  month: number
  year: number
}

export default function CreatePayrollForm({
  employees,
  periods,
}: {
  employees: EmployeeOption[]
  periods: PeriodOption[]
}) {
  const [employeeId, setEmployeeId] = useState("")
  const [periodId, setPeriodId] = useState("")
  const [grossSalary, setGrossSalary] = useState("0")
  const [bonus, setBonus] = useState("0")
  const [deduction, setDeduction] = useState("0")
  const [tax, setTax] = useState("0")
  const [status, setStatus] = useState("draft")
  const [periodModalOpen, setPeriodModalOpen] = useState(false)

  const [state, formAction] = useActionState(createPayroll, { error: null })

  useEffect(() => {
    if (state.error) {
      alert(state.error)
    }
  }, [state.error])

  const netSalary = useMemo(() => {
    const gross = Number(grossSalary) || 0
    const bonusValue = Number(bonus) || 0
    const deductionValue = Number(deduction) || 0
    const taxValue = Number(tax) || 0
    return gross + bonusValue - deductionValue - taxValue
  }, [grossSalary, bonus, deduction, tax])

  return (
        <form
        action={formAction}
        style={{
          width: "100%",
          maxWidth: 640,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            justifyItems: "center"
        }}
        >
        <TextField
            select
            name="employee_id"
            label="Employee"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
        >
            <MenuItem value="" disabled>
            Select employee
            </MenuItem>
            {employees.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
            </MenuItem>
            ))}
        </TextField>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            select
            name="period_id"
            label="Payroll Period"
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            required
            fullWidth
          >
            <MenuItem value="" disabled>
            Select period
            </MenuItem>
            {periods.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.month}/{p.year}
            </MenuItem>
            ))}
          </TextField>

          <IconButton color="primary" onClick={() => setPeriodModalOpen(true)}>
          <AddIcon />
          </IconButton>
        </Stack>

        <TextField
            name="gross_salary"
            type="number"
            label="Gross Salary"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            required
        />
        <TextField
            name="bonus"
            type="number"
            label="Bonus"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
        />
        <TextField
            name="deduction"
            type="number"
            label="Deduction"
            value={deduction}
            onChange={(e) => setDeduction(e.target.value)}
        />
        <TextField
            name="tax"
            type="number"
            label="Tax"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
        />
        <TextField
            name="net_salary"
            type="number"
            label="Net Salary"
            value={netSalary}
            slotProps={{
            input: {
                readOnly: true,
            },
            }}
            required
        />
        <TextField
          select
          name="status"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
            <MenuItem value="pending">Draft</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
        </TextField>

        <Button type="submit" variant="contained">
            Create Payroll
        </Button>

        <Dialog open={periodModalOpen} onClose={() => setPeriodModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Create Payroll Period</DialogTitle>
          <DialogContent>
            <CreatePayrollPeriodForm
              onSuccess={() => {
                setPeriodModalOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
    </form>
  )
}
