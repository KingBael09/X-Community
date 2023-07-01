"use client"

import { useEffect, useState } from "react"
import { Button } from "@/ui/button"
import { Icons } from "@/util/icons"
import { usePrevious } from "@mantine/hooks"
import type { VoteType } from "@prisma/client"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface PostVoteProps {
  postId: string
  initialVoteAmt: number
  initialVote: VoteType | undefined
}

export default function PostVoteClient({
  initialVote,
  initialVoteAmt,
  postId,
}: PostVoteProps) {
  const [votesAmt, setVotesAmt] = useState(initialVoteAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  //   toast({})
  return (
    <div className="flex gap-4 pb-4 pr-6 sm:w-20 sm:flex-col sm:gap-0 sm:pb-0">
      <Button size="sm" variant="ghost" aria-label="upvote">
        <Icons.up
          className={cn("h-5 w-5", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>
      <p className="py-2 text-center text-sm font-medium">{votesAmt}</p>
      <Button size="sm" variant="ghost" aria-label="downvote">
        <Icons.down
          className={cn("h-5 w-5", {
            "text-red-500 fill-red-500": currentVote === "UP",
          })}
        />
      </Button>
    </div>
  )
}
