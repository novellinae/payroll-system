import { getUser } from "@/lib/supabase/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import { randomUUID } from "crypto"
import DashboardLayoutClient from "./layout-client"


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createSupabaseServer()

    const user_auth = await getUser()
    const cookieStore = await cookies()

    if(!user_auth){
        redirect("/login")
    }
    const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("auth_user_id", user_auth.id)
    .single()

  // 🔥 kalau belum ada, auto create
    if (!employee) {
        await supabase.from("employees").insert({
            employee_id: `EMP-${randomUUID()}`,
            first_name: user_auth.email?.split("@")[0] ?? "User",
            last_name: "",
            department: "Unassigned",
            position: "New Employee",
            status: "active",
            auth_user_id: user_auth.id,
            })
    }
    const role = user_auth.user_metadata?.role ?? "employee"
    const initialMode = cookieStore.get("dashboard-theme-mode")?.value === "dark" ? "dark" : "light"

    return(
        <DashboardLayoutClient role={role} initialMode={initialMode}>
            {children}
        </DashboardLayoutClient>
    )

}