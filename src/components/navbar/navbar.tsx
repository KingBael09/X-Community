import Link from "next/link"
import { buttonVariants } from "@/ui/button"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"
import { getAuthSession } from "@/lib/session"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/toggle-theme"
import { UserAccountNav } from "@/components/user-account-nav"

// import { LinkHome } from "./custom-redirect-home"

export default async function Navbar() {
  const user = await getAuthSession()
  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-accent bg-background py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2" aria-label="home">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <span className="hidden text-sm font-medium md:block">
            {siteConfig.name}
          </span>
        </Link>
        {/* <LinkHome /> */}
        <SearchBar />
        <div className="flex items-center gap-2">
          <ThemeToggle className="rounded-full p-2" />
          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Link href="/login" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
