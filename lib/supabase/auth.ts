"use server"

import { createSupabaseServer } from "./server"
import { createSupabaseClient } from "./client"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signUp(email: string, password: string, role: "admin"| "employee" = "employee") {
    const supabase = await createSupabaseServer()

    const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role,
            },
        },
    })
    if (error) {
        throw new Error(error.message)
    }
    return data
}

export async function signIn(email: string, password: string) {
    const supabase = await createSupabaseServer()
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    if (error) {
        throw new Error(error.message)
    }
    console.log("Login successful:", data)
    revalidatePath("/admin/dashboard", "layout")
    return data
}

export async function signInWithGoogle() {
    const supabase = await createSupabaseClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${location.origin}/admin/dashboard`
        }
    })
    if (error) {
        console.error("Google login error:", error)
    }
    console.log("Google login initiated:", data)

    revalidatePath("/admin/dashboard", "layout")
}

export async function signOut() {
    const supabase = await createSupabaseServer()
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.error("Logout error:", error)
    }
    console.log("Logout successful")
}

export async function getUser() {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function requireAuth() {
    const user = await getUser()
    if (!user) {
        redirect("/login")
    }
    return user
}

export async function requireAdmin() {
    const user = await getUser()
    if (!user) {
        redirect("/login")
    }
    const role = user.user_metadata?.role
    if (role !== "admin") {
        redirect("/unauthorized")
    }
    return user
}