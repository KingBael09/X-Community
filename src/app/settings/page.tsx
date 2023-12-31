import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getAuthSession } from "@/lib/session"
import { UserNameForm } from "@/components/forms/user-name-form"
import { ThemeSetting } from "@/components/theme-setting"

export const metadata = {
  title: "Settings",
  description: "Manage account & website settings",
}

export default async function Page() {
  const user = await getAuthSession()

  if (!user) redirect((authOptions.pages?.signIn as string) || "/login")
  return (
    <div className="mx-auto max-w-4xl py-12">
      <div className="grid items-start gap-8">
        <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>
      </div>
      <UserNameForm username={user.username} className="mt-4" />
      <ThemeSetting className="mt-4" />
      <div className="mt-4 flex justify-center text-muted-foreground">
        More Settings Coming Soon!
      </div>
    </div>
  )
}
