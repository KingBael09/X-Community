import Link from "next/link"
import { buttonVariants } from "@/ui/button"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"
import { getAuthSession } from "@/lib/session"
import { SearchBar } from "@/components/searchBar"
import { ThemeToggle } from "@/components/toggleTheme"
import { UserAccountNav } from "@/components/userAccountNav"

export default async function Navbar() {
  const user = await getAuthSession()
  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-accent bg-background py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <span className="hidden text-sm font-medium md:block">
            {siteConfig.name}
          </span>
        </Link>
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
