import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";


export async function proxy(req:NextRequest) {
    const res = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll(){
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet){
                    cookiesToSet.forEach(({ name, value, options }) =>
                    res.cookies.set(name, value, options))
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user){
        return NextResponse.redirect(new URL("/login", req.url))
    }

    const role = user.user_metadata?.role ?? "employee"
    const pathname = req.nextUrl.pathname

    if(pathname.startsWith("/admin") && role !== "admin"){
        return NextResponse.redirect(new URL("/employees", req.url))
    }

    if(pathname.startsWith("/employees") && !["employee", "admin"].includes(role)){
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return res
}

export const config = {
    matcher: ["/admin/:path*", "/employees/:path*"],
}

