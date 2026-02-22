"use client"

import { updatePayroll } from "../action"
import { Button, MenuItem, TextField } from "@mui/material"
import { useMemo, useState } from "react"

export default function EditPayrollForm({
  payrollId,
  initialGrossSalary,
  initialBonus,
  initialDeduction,
  initialTax,
  initialStatus,
}: {
  payrollId: string
  initialGrossSalary: number
  initialBonus: number
  initialDeduction: number
  initialTax: number
  initialStatus: string
}) {
  const [grossSalary, setGrossSalary] = useState(String(initialGrossSalary ?? 0))
  const [bonus, setBonus] = useState(String(initialBonus ?? 0))
  const [deduction, setDeduction] = useState(String(initialDeduction ?? 0))
  const [tax, setTax] = useState(String(initialTax ?? 0))
  const [status, setStatus] = useState(initialStatus || "draft")

  const netSalary = useMemo(() => {
    const gross = Number(grossSalary) || 0
    const bonusValue = Number(bonus) || 0
    const deductionValue = Number(deduction) || 0
    const taxValue = Number(tax) || 0
    return gross + bonusValue - deductionValue - taxValue
  }, [grossSalary, bonus, deduction, tax])

  return (
    <form
      action={updatePayroll.bind(null, payrollId)}
      style={{
        width: "100%",
        maxWidth: 640,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
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
        Update Payroll
      </Button>
    </form>
  )
}
