"use client"

import { Box, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"


type Employee = {
    id: string
    first_name: string
    last_name: string
    department: string
    position: string
    status:  string
}

export default function EmployeesTable({
    data,
    total,
    page,
    pageSize,
    search,
    sort,
    order,
}: {
    data: Employee[]
    total: number
    page: number
    pageSize: number
    search: string
    sort: string
    order: boolean
}) {
    const router = useRouter()
    const params = useSearchParams()

    const updateParams = (newParams: Record<string, string|number|boolean>) => {
        const current = new URLSearchParams(params.toString())
        Object.entries(newParams).forEach(([key, value]) => {
            current.set(key, String(value))
        })

        router.push(`?${current.toString()}`)
    }

    return (
        <>
            <Box sx={{minHeight: "100vh", py:4, px: 4}}>
                {/*Employee Data*/}
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: "100%" }}
                >
                    <Typography variant="h4" fontWeight={600}>
                    Employee Data
                    </Typography>

                    <div className="flex flex-col items-end">
                    <TextField 
                        placeholder="Search..."
                        defaultValue={search}
                        onChange={(e) =>
                            updateParams({
                                search: e.target.value,
                                page:1,
                            })
                        }
                        sx={{mb:2}}
                        />
                    </div>
                </Stack>
                <Table>
                    {/* Table Header */}
                    <TableHead>
                        <TableRow>
                            <TableCell
                                onClick={() =>
                                    updateParams({
                                        sort: "first_name",
                                        order: sort === "first_name" && !order ? "desc" : "asc",
                                    })
                                }
                            >
                                Name
                            </TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {data.map((row) =>(
                            <TableRow key={row.id} hover>
                                <TableCell>{row.first_name} {row.last_name}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>{row.position}</TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                component="div"
                count={total}
                page={page - 1}
                onPageChange={(_, newPage) =>
                    updateParams({page: newPage + 1})
                }
                rowsPerPage={pageSize}
                onRowsPerPageChange={(e) =>
                    updateParams({
                        pageSize: parseInt(e.target.value, 10),
                        page: 1,
                    })
                }
                />
            </Box>
        </>
    )
}