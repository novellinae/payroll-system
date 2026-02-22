
import { createSupabaseServer } from "@/lib/supabase/server";
import CreatePayrollForm from "./create-payroll-form";
import { Box, Typography } from "@mui/material";


export default async function CreatePayrollPage(){
    const supabase = await createSupabaseServer();

    const {data: employees} = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .order("first_name")

    const {data: periods} = await supabase
    .from("payroll_periods")
    .select("id, month, year")
    .order("year", {ascending: false})
    
    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                    Create Payroll
                </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <CreatePayrollForm employees={employees ?? []} periods={periods ?? []} />
            </Box>
        </Box>
    )
}