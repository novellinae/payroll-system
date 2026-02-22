"use client"

import { signUp } from "@/lib/supabase/auth"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Register() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            e.preventDefault()
            setLoading(true)
            await signUp(email, password, "employee")
            router.push("/login")
        } catch (error) {
            console.error("Registration error:", error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex flex-col bg-white items-center justify-center">
            
            <Box
                component="form"
                onSubmit={handleRegister}
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
                    Register
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
                <Button variant="contained" color="primary" onClick={handleRegister} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </Button>
                <Button variant="text" sx={{ color: "#ffffff" }} onClick={() => router.push("/login")}>
                    Already have an account? Login
                </Button>
            </Box>
        </div>
    )
}
        