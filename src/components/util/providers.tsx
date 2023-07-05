"use client"

import type { LayoutProps } from "@/types"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function Providers({ children, ...props }: LayoutProps) {
  const queryClient = new QueryClient()

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <QueryClientProvider client={queryClient} {...props}>
        {children}
      </QueryClientProvider>{" "}
    </NextThemesProvider>
  )
}
