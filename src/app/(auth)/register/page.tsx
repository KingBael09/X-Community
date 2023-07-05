import Link from "next/link"
import { buttonVariants } from "@/ui/button"
import { Icons } from "@/util/icons"

import { cn } from "@/lib/utils"
import SignUp from "@/components/auth-form-template"

export const metadata = {
  title: "Sign Up",
  description: "Create an account?",
}

export default function Page() {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn("self-start", buttonVariants({ variant: "ghost" }))}
        >
          <Icons.back className="mr-2 h-4 w-4" />
          Home
        </Link>

        <SignUp name="register" />
      </div>
    </div>
  )
}
