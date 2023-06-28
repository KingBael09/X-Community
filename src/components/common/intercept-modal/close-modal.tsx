"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/ui/button"
import { Icons } from "@/util/icons"

export default function CloseModal() {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      className="h-6 w-6 rounded-md p-0"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <Icons.close className="h-4 w-4" />
    </Button>
  )
}
