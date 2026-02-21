"use client"

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import React from "react"

const theme = createTheme()

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode
}) {
    const [cache] = React.useState(() =>
    createCache({ key: "mui", prepend: true}))

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    )
}