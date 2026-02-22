import { createSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const role = user.user_metadata?.role ?? "employee"

  if (role === "admin") {
    redirect("/admin/dashboard")
  }

  redirect("/employees/dashboard")
}
