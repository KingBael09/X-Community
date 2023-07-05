"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/ui/button"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"

export function LinkHome() {
  const router = useRouter()
  return (
    <Button
      onClick={() => {
        router.push("/")
        router.refresh()
      }}
      variant="link"
      className="flex items-center gap-2"
    >
      <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
      <span className="hidden text-sm font-medium md:block">
        {siteConfig.name}
      </span>
    </Button>
  )
}

// TODO: This is temporary fix, link components partly caches things
