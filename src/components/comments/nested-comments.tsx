import type { CommentVote, Comment as DBComment, User } from "@prisma/client"
import type { User as AuthUser } from "next-auth"

import { Comment } from "./comment"
import ExtraComments from "./comment-modal"

type Comments = DBComment & {
  author: User
  replies: DBComment[]
  votes: CommentVote[]
}

export interface NestedCommentProps {
  comments: Comments[]
  postId: string
  parentId: string
  user: AuthUser | null
  count?: number
}

export function NestedComments({
  comments,
  parentId,
  postId,
  user,
  count = 0,
}: NestedCommentProps) {
  const filteredComments = comments
    .filter((comment) => comment.replyToId === parentId)
    .sort((a, b) => b.votes.length - a.votes.length)

  if (count >= 4 && filteredComments.length !== 0)
    return (
      <ExtraComments>
        {filteredComments.map((comment) => {
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
              className="ml-2 border-l-2 border-accent pl-3 pt-3"
            >
              <Comment
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
                count={2}
              />
            </div>
          )
        })}
      </ExtraComments>
    )

  return filteredComments.map((comment) => {
    const replyVotesAmt = comment.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1
      if (vote.type === "DOWN") return acc - 1
      return acc
    }, 0)
    const currentReplyVote = comment.votes.find(
      (vote) => vote.userId === user?.id
    )

    return (
      <div key={comment.id} className="ml-2 border-l-2 border-accent pl-3 pt-3">
        <Comment
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
          count={count + 1}
        />
      </div>
    )
  })
}
