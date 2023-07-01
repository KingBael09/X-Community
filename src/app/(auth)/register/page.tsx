import type { Metadata } from "next"
import Link from "next/link"
import SignUp from "@/common/auth"
import { buttonVariants } from "@/ui/button"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an accound?",
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

        <SignUp name="register" />
      </div>
    </div>
  )
}
