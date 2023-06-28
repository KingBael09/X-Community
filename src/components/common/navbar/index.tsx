import Link from "next/link"
import { Icons } from "@/util/icons"
import { getServerSession } from "next-auth"

import { siteConfig } from "@/config/site"
import { authOptions } from "@/lib/auth"
import { getAuthSession } from "@/lib/session"
import { buttonVariants } from "@/components/ui/button"
import { UserAccountNav } from "@/components/userAccountNav"

import { ThemeToggle } from "../../toggleTheme"

export default async function Navbar() {
  const session = await getAuthSession()
  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-accent bg-background py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <span className="hidden text-sm font-medium md:block">
            {siteConfig.name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="rounded-full p-2" />
          {session ? (
            <UserAccountNav user={session} />
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
