import { Separator } from "@/ui/separator"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"

import { CreateComment } from "./createComment"
import { SubComment } from "./subComment"

interface CommentsSectionProps {
  postId: string
}

export async function CommentsSection({ postId }: CommentsSectionProps) {
  const user = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId: postId,
      replyToId: null, // only fetch top-level comments
    },
    include: {
      author: true,
      votes: true,
      replies: {
        // first level replies
        include: {
          author: true,
          votes: true,
        },
      },
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
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <SubComment
                    postId={postId}
                    comment={topLevelComment}
                    votesAmt={topLevelCommentVotesAmt}
                    currentVote={currentTopLevelCommentVote}
                    user={user}
                  />
                </div>
                {/* sort by likes */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1
                      if (vote.type === "DOWN") return acc - 1
                      return acc
                    }, 0)
                    const currentReplyVote = reply.votes.find(
                      (vote) => vote.userId === user?.id
                    )

                    return (
                      <div
                        key={reply.id}
                        className="ml-2  border-l-2 border-accent py-2 pl-4"
                      >
                        <SubComment
                          user={user}
                          postId={postId}
                          comment={reply}
                          votesAmt={replyVotesAmt}
                          currentVote={currentReplyVote}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}
