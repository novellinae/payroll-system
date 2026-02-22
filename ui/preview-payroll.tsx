"use client"

import { getPayslipPreview } from "@/app/admin/payroll/action"
import VisibilityIcon from "@mui/icons-material/Visibility"
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material"
import { useState } from "react"

export default function PayrollPreview({
    filePath,
    buttonType = "icon",
    label = "Preview",
}: {
    filePath?: string | null
    buttonType?: "icon" | "text"
    label?: string
}) {
    const [open, setOpen] = useState(false)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleOpen = async () => {
        if (!filePath || loading) return

        setLoading(true)
        setError(null)

        try {
            const url = await getPayslipPreview(filePath)
            if (!url) {
                setError("Payslip file not found")
                return
            }
            setPdfUrl(url)
            setOpen(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to preview payslip")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const disabled = !filePath || loading



    return (
        <>
            {buttonType === "text" ? (
                <Button size="small" onClick={handleOpen} disabled={disabled}>
                    {loading ? "Loading..." : label}
                </Button>
            ) : (
                <IconButton onClick={handleOpen} disabled={disabled}>
                    <VisibilityIcon />
                </IconButton>
            )}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Payslip Preview</DialogTitle>
                <DialogContent sx={{ height: 600 }}>
                    {loading && (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!loading && error && (
                        <Typography color="error">{error}</Typography>
                    )}
                    {!loading && !error && pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                            title="Payslip Preview"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}