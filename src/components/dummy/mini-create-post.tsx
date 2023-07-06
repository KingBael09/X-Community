import type { MiniCreatePostProps } from "@/types"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Icons } from "@/util/icons"

import { UserAvatar } from "@/components/user-avatar"

import { PostSubmitLink } from "./custom-post-link"

export function MiniCreatePost({ user }: MiniCreatePostProps) {
  return (
    <div className="overflow-hidden rounded-md bg-background shadow">
      <PostSubmitLink className="flex h-full flex-col justify-between gap-2 px-6 py-4 md:flex-row md:gap-6">
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
          <Input readOnly placeholder="Create Post" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" aria-label="image">
            <Icons.image />
          </Button>
          <Button variant="ghost" aria-label="link">
            <Icons.link />
          </Button>
        </div>
      </PostSubmitLink>
    </div>
  )
}
