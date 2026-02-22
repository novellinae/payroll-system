import { Box, Card, CardContent, Typography } from "@mui/material"


export default function InsightCard({
    title,
    value,
    subtitle,
}: {
    title: string
    value: number | string
    subtitle?: string
}) {
    return (
        <Card sx={{borderRadius: 4, boxShadow: 2}}>
            <CardContent>
                <Typography variant="body1" color="text.secondary" textAlign={"center"}>
                    {title}
                </Typography>
                <Box mt={1}>
                    <Typography variant="h4" fontWeight={600} mt={1} textAlign={"center"}>
                        {value}
                    </Typography>
                </Box>

                {subtitle && (
                    <Typography variant="caption" color="text.secondary" textAlign={"center"} display="block">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
}