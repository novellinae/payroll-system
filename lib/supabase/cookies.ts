import { NextResponse } from "next/server"

export type SupabaseCookieToSet = {
  name: string
  value: string
  options?: Parameters<ReturnType<typeof NextResponse.next>["cookies"]["set"]>[2]
}
