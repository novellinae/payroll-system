"use client"
import { signOut } from "@/lib/supabase/auth"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { AppBar, Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Tooltip, Typography, createTheme, ThemeProvider } from "@mui/material"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"



export default function DashboardLayoutClient({
    children,
    role,
    initialMode,
}: {
    children: React.ReactNode
    role: string
    initialMode: "light" | "dark"
}) {
    const router = useRouter()
    const [mode, setMode] = useState<"light" | "dark">(initialMode)

    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

    const handleToggleTheme = () => {
        const nextMode = mode === "dark" ? "light" : "dark"
        setMode(nextMode)
        document.cookie = `dashboard-theme-mode=${nextMode}; path=/; max-age=31536000; samesite=lax`
    }

    const handleLogout = async () => {
        await signOut()
        router.push("/login")
    }

    return(
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
            }}>
                {/* Sidebar */}
                <Drawer variant="permanent">
                    <Box sx={{
                            width: 240,
                            flexShrink: 0,
                        }}>
                        <Typography variant="h6" sx={{p:2}}>
                            Payroll System
                        </Typography>

                        <List>
                            <ListItemButton onClick={() => router.push(role === "admin" ? "/admin/dashboard" : "/employees")}>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                            <ListItemButton onClick={() => router.push(role === "admin" ? "/admin/employee" : "/employees/employee")}>
                                <ListItemText primary="Employees" />
                            </ListItemButton>
                            <ListItemButton onClick={() => router.push(role === "admin" ? "/admin/payroll" : "/employees/payroll")}>
                                <ListItemText primary="Payroll" />
                            </ListItemButton>
                            
                        </List>
                    </Box>
                </Drawer>
                {/* {Main Content} */}
                <Box sx={{ flexGrow:1}}>
                    <AppBar position="static">
                        <Toolbar sx={{display:"flex", justifyContent: "space-between"}}>
                            <Typography variant="h6">Dashboard</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                                    <IconButton color="inherit" onClick={handleToggleTheme}>
                                        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                                    </IconButton>
                                </Tooltip>
                                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <Box sx={{p:4,
                        mt: 8,
                        ml : "240px",
                        minHeight: "100vh"
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}