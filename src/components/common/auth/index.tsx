import Link from "next/link"
import { UserAuthForm } from "@/forms/userAuthForm"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"

interface TemplateProps {
  name: "login" | "register"
}

export default function AuthFormTemplate({ name }: TemplateProps) {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">
          {name === "login" ? "Welcome back" : "Sign Up"}
        </h1>
        <p className="mx-auto max-w-xs text-sm">
          By continuing, you are setting up a {siteConfig.name} account and
          agree to our User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        {name === "login"
          ? `New to ${siteConfig.name}?`
          : "Already have an account?"}{" "}
        <Link
          href={name === "login" ? "/register" : "/login"}
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          {name === "login" ? "Register" : "Login"}
        </Link>
      </p>
    </div>
  )
}
