import { createSupabaseServer } from "@/lib/supabase/server"
import EmployeesTable from "./table"



export default async function EmployeesPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string
        pageSize?: string
        search?: string
        sort?: string
        order?: string
    }>
}) {
    const supabase = await createSupabaseServer()

    const params = await searchParams

    const page = Number(params.page ?? 1)
    const pageSize = Number(params.pageSize ?? 5)
    const search = params.search ?? ""
    const sort = params.sort ?? "first_name"
    const order = params.order ===  "desc"

    let query = supabase
    .from("employees")
    .select("*", {count: "exact"})

    if (params.search){
        query = query.ilike("first_name", `%${params.search}%`)
    }

    query = query.order(sort, {ascending: !order})

    const {data, count} = await query.range(
        (page-1) * pageSize,
        page * pageSize - 1
    )

    return(
        <EmployeesTable
            data={data ?? []}
            total={count ?? 0}
            page={page}
            pageSize={pageSize}
            search={search}
            sort={sort}
            order={order}
        />
        
    )
}