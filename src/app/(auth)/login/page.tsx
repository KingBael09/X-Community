import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/ui/button"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import SignIn from "@/components/common/auth"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign into your account",
}

export default function Page() {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn("self-start", buttonVariants({ variant: "ghost" }))}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Home
        </Link>

        <SignIn name="login" />
      </div>
    </div>
  )
}
