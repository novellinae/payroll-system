"use client"

import { createSupabaseClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const supabase = createSupabaseClient()

    async function test() {
      const {data, error} = await supabase
      .from("employees")
      .select("*")

      console.log(data, error)
    }

    test()
  }, [])
  

  redirect("/admin/dashboard")

  return (
    <div>
      Supabase Connected
    </div>
  );
}
