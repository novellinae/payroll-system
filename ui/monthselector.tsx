import { MenuItem, Select } from "@mui/material"


export default function MonthSelector({
    month,
    onChange,
}: {
    month: number
    onChange: (value: number) => void
}) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    return(
        <Select
            value={month}
            onChange={(e) => onChange(Number(e.target.value))}
            size="small"
            sx={{minWidth: 150}}
        >
            {months.map((m, index) => (
                <MenuItem key={index} value={index + 1}>
                    {m}
                </MenuItem>
            ))}
        </Select>
    )
}