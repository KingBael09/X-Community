import { Separator } from "@/ui/separator"

import { CommunityCreateForm } from "@/components/forms/com-create-form"

export const metadata = {
  title: "Create Community",
}

export default function Page() {
  return (
    <div className="container mx-auto flex h-full max-w-3xl items-center">
      <div className="h-fit w-full space-y-6 rounded-lg bg-background p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>
        <Separator />
        <CommunityCreateForm />
      </div>
    </div>
  )
}
