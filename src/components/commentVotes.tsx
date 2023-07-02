"use client"

import { useEffect, useState, useTransition } from "react"
import { voteCommentAction } from "@/actions/post"
import { Button } from "@/ui/button"
import { usePrevious } from "@mantine/hooks"
import type { CommentVote, VoteType } from "@prisma/client"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import { Icons } from "./util/icons"

export interface CommentVoteProps {
  commentId: string
  initialVoteAmt: number
  initialVote?: Pick<CommentVote, "type">
}

export function CommentVotes({
  initialVote,
  initialVoteAmt,
  commentId,
}: CommentVoteProps) {
  const [votesAmt, setVotesAmt] = useState(initialVoteAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const [isPending, startTransition] = useTransition()

  // TODO : Think Postfeed Alltogether

  const handleClick = (type: VoteType) => {
    startTransition(async () => {
      try {
        // Doing optimistic updates
        if (currentVote?.type === type) {
          // User is voting the same way again, so remove their vote
          setCurrentVote(undefined)
          if (type === "UP") setVotesAmt((prev) => prev - 1)
          else if (type === "DOWN") setVotesAmt((prev) => prev + 1)
        } else {
          // User is voting in the opposite direction, so subtract 2
          setCurrentVote({ type })
          if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
          else if (type === "DOWN")
            setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
        }
        // performing updates
        const res = await voteCommentAction({
          type,
          commentId,
        })

        toast({
          title: "Success",
          description: res.message,
        })
      } catch (e) {
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : "Something Went Wrong",
          variant: "destructive",
        })

        // Undoing optimistic updates
        if (type === "UP") setVotesAmt((prev) => prev - 1)
        else if (type === "DOWN") setVotesAmt((prev) => prev + 1)

        setCurrentVote(prevVote)
      }
    })
  }
  return (
    <div className="flex gap-1">
      <Button
        disabled={isPending}
        onClick={() => {
          handleClick("UP")
        }}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <Icons.up
          className={cn("h-5 w-5", {
            "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
          })}
        />
      </Button>
      <p className="flex justify-center py-2 text-center text-sm font-medium">
        {isPending ? (
          <Icons.loading className="h-4 w-4 animate-spin" />
        ) : (
          votesAmt
        )}
      </p>
      <Button
        disabled={isPending}
        onClick={() => {
          handleClick("DOWN")
        }}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <Icons.down
          className={cn("h-5 w-5", {
            "text-red-500 fill-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  )
}
