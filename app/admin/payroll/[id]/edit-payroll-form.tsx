"use client"

import { updatePayroll } from "../action"
import PayrollPreview from "@/ui/preview-payroll"
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

export default function EditPayrollForm({
  payrollId,
  initialGrossSalary,
  initialBonus,
  initialDeduction,
  initialTax,
  initialStatus,
  initialPayslipPath,
}: {
  payrollId: string
  initialGrossSalary: number
  initialBonus: number
  initialDeduction: number
  initialTax: number
  initialStatus: string
  initialPayslipPath?: string | null
}) {
  const [grossSalary, setGrossSalary] = useState(String(initialGrossSalary ?? 0))
  const [bonus, setBonus] = useState(String(initialBonus ?? 0))
  const [deduction, setDeduction] = useState(String(initialDeduction ?? 0))
  const [tax, setTax] = useState(String(initialTax ?? 0))
  const [status, setStatus] = useState(initialStatus || "draft")
  const [selectedPayslip, setSelectedPayslip] = useState<File | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const netSalary = useMemo(() => {
    const gross = Number(grossSalary) || 0
    const bonusValue = Number(bonus) || 0
    const deductionValue = Number(deduction) || 0
    const taxValue = Number(tax) || 0
    return gross + bonusValue - deductionValue - taxValue
  }, [grossSalary, bonus, deduction, tax])

  const selectedPayslipUrl = useMemo(() => {
    if (!selectedPayslip) return null
    return URL.createObjectURL(selectedPayslip)
  }, [selectedPayslip])

  useEffect(() => {
    return () => {
      if (selectedPayslipUrl) {
        URL.revokeObjectURL(selectedPayslipUrl)
      }
    }
  }, [selectedPayslipUrl])

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

      <Stack direction="row" spacing={1} alignItems="center">
        {initialPayslipPath ? (
          <PayrollPreview filePath={initialPayslipPath} buttonType="text" label="Preview Current PDF" />
        ) : null}
        <Button
          type="button"
          variant="outlined"
          disabled={!selectedPayslipUrl}
          onClick={() => setPreviewOpen(true)}
        >
          Preview Selected PDF
        </Button>
      </Stack>

      <TextField
        type="file"
        name="payslip"
        inputProps={{accept: "application/pdf"}}
        onChange={(e) => {
          const file = (e.currentTarget as HTMLInputElement).files?.[0] ?? null
          setSelectedPayslip(file)
        }}
      />

      <Button type="submit" variant="contained">
        Update Payroll
      </Button>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Payslip Preview</DialogTitle>
        <DialogContent sx={{ height: 600 }}>
          {selectedPayslipUrl && (
            <iframe
              src={selectedPayslipUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Selected Payslip Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </form>
  )
}
