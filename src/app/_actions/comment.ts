"use server"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"
import type { ZCommentVote } from "@/lib/validators/post"
import type { ZComment } from "@/components/createComment"

export async function commentPostAction({
  postId,
  comment,
  replyToId,
}: ZComment) {
  const user = await getAuthSession()

  if (!user) {
    throw new Error("Unauthorized! Please login to comment")
  }

  await db.comment.create({
    data: {
      text: comment,
      postId,
      replyToId,
      authorId: user.id,
    },
  })

  return { message: "Success" }
}

export async function voteCommentAction({ commentId, type }: ZCommentVote) {
  const user = await getAuthSession()

  if (!user) {
    throw new Error("Unauthorized! Please login to vote")
  }

  const existingVote = await db.commentVote.findFirst({
    where: {
      commentId,
      userId: user.id,
    },
  })

  if (existingVote) {
    // if orignal vote clicked again then delete the vote
    if (existingVote.type === type) {
      await db.commentVote.delete({
        where: {
          userId_commentId: {
            commentId,
            userId: user.id,
          },
        },
      })

      return { message: `Removed your ${type.toLowerCase()}vote!` }
    }

    // otherwise if other than the orignal vote is clicked then update the vote
    await db.commentVote.update({
      where: {
        userId_commentId: {
          commentId,
          userId: user.id,
        },
      },
      data: {
        type,
      },
    })

    return { message: "Updated your vote!" }
  }

  // if no vote existed before
  await db.commentVote.create({
    data: {
      type,
      commentId,
      userId: user.id,
    },
  })

  return { message: `Post ${type.toLowerCase()}voted` }
}
