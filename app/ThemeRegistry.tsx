"use client"

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { useServerInsertedHTML } from "next/navigation"
import React from "react"

const theme = createTheme()

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode
}) {
    const [{ cache, flush }] = React.useState(() => {
        const cache = createCache({ key: "mui", prepend: true })
        cache.compat = true

        const prevInsert = cache.insert
        let inserted: string[] = []

        cache.insert = (...args) => {
            const serialized = args[1]
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name)
            }
            return prevInsert(...args)
        }

        const flush = () => {
            const prevInserted = inserted
            inserted = []
            return prevInserted
        }

        return { cache, flush }
    })

    useServerInsertedHTML(() => {
        const names = flush()
        if (names.length === 0) {
            return null
        }

        let styles = ""
        for (const name of names) {
            styles += cache.inserted[name]
        }

        return (
            <style
                data-emotion={`${cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{ __html: styles }}
            />
        )
    })

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    )
}