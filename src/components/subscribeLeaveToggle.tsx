"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  subscribeCommunityAction,
  unSubscribeCommunityAction,
} from "@/actions/community"
import type { SubscribeLeaveToggleProps } from "@/types"
import { Button } from "@/ui/button"
import { Icons } from "@/util/icons"

import { toast } from "@/hooks/use-toast"

export function SubscribeLeaveToggle({
  communityId,
  isSubscribed,
  communityName,
}: SubscribeLeaveToggleProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSubscribe() {
    startTransition(async () => {
      try {
        await subscribeCommunityAction({ communityId })
        toast({
          title: "Success",
          description: `You are now Subscribed to x/${communityName}`,
        })
        router.refresh()
      } catch (e) {
        toast({
          title: "Error",
          description: "Unauthorized! Please Login",
          variant: "destructive",
        })
      }
    })
  }

  function handleLeave() {
    startTransition(async () => {
      try {
        await unSubscribeCommunityAction({ communityId })
        toast({
          title: "Success",
          description: `Unsubscribed from x/${communityName}`,
        })
        router.refresh()
      } catch (e) {
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : "Something Went Wrong",
          variant: "destructive",
        })
      }
    })
  }

  return isSubscribed ? (
    <Button
      disabled={isPending}
      onClick={handleLeave}
      variant="destructive"
      className="mb-4 mt-1 w-full"
    >
      {isPending ? (
        <Icons.loading className="h-4 w-4 animate-spin" />
      ) : (
        "Leave Community"
      )}
    </Button>
  ) : (
    <Button
      disabled={isPending}
      onClick={handleSubscribe}
      className="mb-4 mt-1 w-full"
    >
      {isPending ? (
        <Icons.loading className="h-4 w-4 animate-spin" />
      ) : (
        "Join to Post"
      )}
    </Button>
  )
}
