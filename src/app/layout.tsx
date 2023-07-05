import "@/global-style"

import type { LayoutProps } from "@/types"
import { Analytics } from "@/util/analytics"
import { TailwindIndicator } from "@/util/tailwind-indicator"
import { Toaster } from "@/util/toaster"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar/navbar"
import { Providers } from "@/components/util/providers"

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RoolLayoutProps extends LayoutProps {
  authModel: React.ReactNode
}

export default function RootLayout({ children, authModel }: RoolLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // className="[scrollbar-gutter:stable]"
    >
      <body
        className={cn(
          "min-h-screen bg-background pt-12 font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <Analytics />
          <Navbar />
          {authModel}
          <div className="container mx-auto h-full max-w-7xl pt-12">
            {children}
          </div>
          <Toaster />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  )
}
