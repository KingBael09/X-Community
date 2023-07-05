"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/ui/button"
import { Icons } from "@/util/icons"
import type { Comment, CommentVote, User } from "@prisma/client"
import { type User as AuthUser } from "next-auth"

import { formatTimeToNow } from "@/lib/utils"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { UserAvatar } from "@/components/user-avatar"

import { CommentVotes } from "./comment-vote"
import { CreateComment } from "./create-comment"

interface SubCommentProps {
  postId: string
  comment: Comment & { votes: CommentVote[]; author: User }
  votesAmt: number
  currentVote?: CommentVote
  user: AuthUser | null
}

export function Comment({
  postId,
  comment,
  votesAmt,
  currentVote,
  user,
}: SubCommentProps) {
  const router = useRouter()
  const [isReplying, setIsReplying] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)

  const handleReply = () => {
    if (!user) return router.push("/login")
    setIsReplying(!isReplying)
  }

  const handleClose = () => {
    setIsReplying(false)
  }

  useOnClickOutside(commentRef, () => {
    setIsReplying(false)
  })

  return (
    <div ref={commentRef} className="flex flex-col text-primary">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium">u/{comment.author.username}</p>
          <p className="max-h-40 truncate text-xs text-muted-foreground">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="mt-2 text-left text-sm">{comment.text}</p>
      <div className="my-1 flex items-center gap-2">
        <CommentVotes
          commentId={comment.id}
          initialVoteAmt={votesAmt}
          initialVote={currentVote}
        />
        <Button variant="ghost" size="sm" onClick={handleReply}>
          <Icons.comment className="mr-1.5 h-4 w-4" />
          Reply
        </Button>
      </div>
      {isReplying && (
        <div className="mt-2 w-full pr-1">
          <CreateComment
            isSubComment
            postId={postId}
            replyToId={comment.id}
            closeAction={handleClose}
          />
        </div>
      )}
    </div>
  )
}
