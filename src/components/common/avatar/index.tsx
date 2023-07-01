import Image from "next/image"
import { Avatar, AvatarFallback } from "@/ui/avatar"
import { Icons } from "@/util/icons"
import type { AvatarProps } from "@radix-ui/react-avatar"
import type { User } from "next-auth"

export interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">
}
export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            sizes="10vw"
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
