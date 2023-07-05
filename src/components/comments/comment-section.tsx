import { Separator } from "@/ui/separator"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"

import { Comment } from "./comment"
import { CreateComment } from "./create-comment"
import { NestedComments } from "./nested-comments"

interface CommentsSectionProps {
  postId: string
}

export async function CommentSection({ postId }: CommentsSectionProps) {
  const user = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      author: true,
      votes: true,
      replies: true,
    },
  })

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <Separator />
      <CreateComment postId={postId} />
      <div className="mt-4 flex flex-col gap-y-6">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1
                if (vote.type === "DOWN") return acc - 1
                return acc
              },
              0
            )
            const currentTopLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === user?.id
            )

            return (
              <div
                key={topLevelComment.id}
                className="flex flex-col overflow-y-auto"
              >
                <div className="mb-2">
                  <Comment
                    postId={postId}
                    comment={topLevelComment}
                    votesAmt={topLevelCommentVotesAmt}
                    currentVote={currentTopLevelCommentVote}
                    user={user}
                  />
                  <NestedComments
                    comments={comments}
                    parentId={topLevelComment.id}
                    postId={postId}
                    user={user}
                  />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
