"use client"
import { signOut } from "@/lib/supabase/auth"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Tooltip, Typography, createTheme, ThemeProvider } from "@mui/material"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import ReceiptIcon from '@mui/icons-material/Receipt';



export default function DashboardLayoutClient({
    children,
    role,
    initialMode,
}: {
    children: React.ReactNode
    role: string
    initialMode: "light" | "dark"
}) {
    const drawerWidth = 240
    const router = useRouter()
    const [mode, setMode] = useState<"light" | "dark">(initialMode)

    const theme = useMemo(
        () =>
            createTheme({
                palette: { mode },
                typography: {
                    fontFamily: "var(--font-poppins), sans-serif",
                },
            }),
        [mode]
    )

    const handleToggleTheme = () => {
        const nextMode = mode === "dark" ? "light" : "dark"
        setMode(nextMode)
        document.cookie = `dashboard-theme-mode=${nextMode}; path=/; max-age=31536000; samesite=lax`
    }

    const handleLogout = async () => {
        await signOut()
        router.push("/login")
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: "flex",
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    color: "text.primary",
                }}
            >
                {/* Sidebar */}
                <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            "& .MuiDrawer-paper": {
                                width: drawerWidth,
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                            },
                        }}
                    >
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", mt:4}}>
                        <Typography variant="h5" fontWeight={600} sx={{ p: 2 }}>
                            Payroll System
                        </Typography>

                        <List sx={{ flexGrow: 1, ml: 2}}>
                            <ListItemButton onClick={() => router.push(role === "admin" ? "/admin/dashboard" : "/employees/dashboard")}>
                                <HomeIcon sx={{ mr: 1 }} />
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                            {role === "admin" && (
                                <ListItemButton onClick={() => router.push("/admin/employee")}>
                                    <BadgeIcon sx={{ mr: 1 }} />
                                    <ListItemText primary="Employees" />
                                </ListItemButton>
                            )}
                            <ListItemButton onClick={() => router.push(role === "admin" ? "/admin/payroll" : "/employees/payroll")}>
                                <ReceiptIcon sx={{ mr: 1 }} />
                                <ListItemText primary="Payroll" />
                            </ListItemButton>
                        </List>

                        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Button color="inherit" onClick={handleLogout} sx={{ fontWeight: 600 }}>Logout</Button>
                            <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                                <IconButton color="inherit" onClick={handleToggleTheme}>
                                    {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon sx={{ color: "warning.main" }} />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    </Drawer>
                </Box>
                {/* {Main Content} */}
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <Box sx={{ p: 4, minHeight: "100vh" }}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}