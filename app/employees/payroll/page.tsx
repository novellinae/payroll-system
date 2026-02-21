import { createSupabaseServer } from "@/lib/supabase/server";
import EmployeePayrolll from "./employee-view";


export default async function PayrollPage() {
    const supabase = await createSupabaseServer()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    

    return <EmployeePayrolll userId={user.id} />
}