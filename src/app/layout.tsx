import "@/global-style"

import type { LayoutProps } from "@/types"
import { Analytics } from "@/util/analytics"
import { ThemeProvider } from "@/util/providers"
import { TailwindIndicator } from "@/util/tailwind-indicator"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Navbar from "@/components/common/navbar"

import { Toaster } from "../components/util/toaster"

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RoootLayoutProps extends LayoutProps {
  authModel?: React.ReactNode
}

export default function RootLayout({ children, authModel }: RoootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background pt-12 font-sans antialiased",
          fontSans.variable
        )}
      >
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {authModel}
          <div className="container mx-auto h-full max-w-7xl pt-12">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
        <TailwindIndicator />
      </body>
    </html>
  )
}
