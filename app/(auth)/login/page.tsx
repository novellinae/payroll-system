"use client"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { signIn } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            const data = await signIn(
            email,
            password
            )
            const role = data.user?.user_metadata?.role
            if (role === "admin") {
                router.replace("/admin/dashboard")
            } else {
                router.replace("/employees/dashboard")
            }
            
        } catch (error) {
            console.error("An unexpected error occurred. Please try again.", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white items-center justify-center">
                   
            <Box 
                sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 2,
                    p: 4,
                    gap: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h4" fontWeight={600} mb={3}>
                    Login
                </Typography>
                <TextField
                    required
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        bgcolor: "grey-100"
                    }}
                />
                <TextField
                    required
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        bgcolor: "grey-100"
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
                <Button variant="text" sx={{ color: "#ffffff" }} onClick={() => router.push("/register")}>
                    {"Don't have an account? Register"}
                </Button>
            </Box>   
        </div>
    )
}
