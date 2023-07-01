"use client"

import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import { UserAvatar } from "@/common/avatar/index"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Icons } from "@/util/icons"
import type { User } from "next-auth"

interface MiniCreatePostProps {
  user: User | null
}

export default function MiniCreatePost({ user }: MiniCreatePostProps) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <li className="overflow-hidden rounded-md bg-background shadow">
      <div className="flex h-full flex-col justify-between gap-2 px-6 py-4 md:flex-row md:gap-6">
        <div className="flex w-full items-center gap-2">
          <div className="relative">
            <UserAvatar
              user={{
                name: user?.name || null,
                image: user?.image || null,
              }}
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-accent-foreground bg-green-500 outline outline-1" />
          </div>
          <Input
            readOnly
            onClick={() => router.push(`${pathname}/submit` as Route)}
            placeholder="Create Post"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost">
            <Icons.image />
          </Button>
          <Button variant="ghost">
            <Icons.link />
          </Button>
        </div>
      </div>
    </li>
  )
}
