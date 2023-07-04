import React from "react"
import type { Comment, CommentVote, User } from "@prisma/client"
import type { User as AuthUser } from "next-auth"

import { getAuthSession } from "@/lib/session"
import { CreateComment } from "@/components/createComment"
import { SubComment } from "@/components/subComment"

type Comments = Comment & {
  author: User
  replies: Comment[]
  votes: CommentVote[]
}

interface TestProps {
  comments: Comments[]
  postId: string
}

export default async function TestComponent({ comments, postId }: TestProps) {
  const user = await getAuthSession()
  return (
    <div>
      {comments.map((comment) => {
        if (!comment.replyToId)
          return (
            <div key={comment.id}>
              {comment.text}
              <NestedComments
                postId={postId}
                comments={comments}
                parentId={comment.id}
                user={user}
              />
            </div>
          )
      })}
    </div>
  )
}

function NestedComments({
  comments,
  parentId,
  postId,
  user,
}: TestProps & { parentId: string } & { user: AuthUser | null }) {
  return comments.map((comment) => {
    if (comment.replyToId === parentId) {
      const replyVotesAmt = comment.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1
        if (vote.type === "DOWN") return acc - 1
        return acc
      }, 0)
      const currentReplyVote = comment.votes.find(
        (vote) => vote.userId === user?.id
      )

      return (
        <div
          key={comment.id}
          className="ml-2  border-l-2 border-accent py-2 pl-4"
        >
          <SubComment
            user={user}
            postId={postId}
            comment={comment}
            votesAmt={replyVotesAmt}
            currentVote={currentReplyVote}
          />
          <NestedComments
            user={user}
            postId={postId}
            comments={comments}
            parentId={comment.id}
          />
        </div>
      )
    }
  })
}
