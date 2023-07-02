"use server"

import { UPVOTE_CACHE_THRESHOLD } from "@/config"
import type { Post, User, Vote, VoteType } from "@prisma/client"

import type { CachedPost } from "@/types/redis"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { getAuthSession } from "@/lib/session"
import type { ZCommentVote, ZPost, ZPostVote } from "@/lib/validators/post"
import type { ZComment } from "@/components/createComment"

export async function createPostAction({ title, communityId, content }: ZPost) {
  const user = await getAuthSession()

  if (!user) {
    throw new Error("Unauthorized! Please login")
  }

  const checkSubscription = await db.subscription.findFirst({
    where: {
      communityId,
      userId: user.id,
    },
  })

  if (!checkSubscription) {
    throw new Error("Subscribe to community to post!")
  }

  await db.post.create({
    data: {
      title,
      content,
      communityId,
      authorId: user.id,
    },
  })
}

// export async function upVotePostAction() {}
// export async function downVotePostAction() {}

interface CacheProps extends Post {
  votes: Vote[]
  author: User
}

async function cachePost(post: CacheProps, type: VoteType) {
  // Recount the votes, so that the posts above the threshold can be cached

  const votesAmt = post.votes.reduce((acc, vote) => {
    if (vote.type === "UP") return acc + 1
    if (vote.type === "DOWN") return acc - 1
    return acc
  }, 0)

  if (votesAmt > UPVOTE_CACHE_THRESHOLD) {
    const cachedPayload = {
      id: post.id,
      title: post.title,
      content: JSON.stringify(post.content),
      createdAt: post.createdAt,
      currentVote: type,
      authorUserName: post.author.username ?? "",
    } satisfies CachedPost

    await redis.hset(`post:${post.id}`, cachedPayload)
  }
}

export async function votePostAction({ postId, type }: ZPostVote) {
  const user = await getAuthSession()

  if (!user) {
    throw new Error("Unauthorized! Please login to vote")
  }

  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
      votes: true,
    },
  })

  if (!post) {
    throw new Error("Something went wrong! Post not found!")
  }

  const existingVote = await db.vote.findFirst({
    where: {
      postId,
      userId: user.id,
    },
  })

  if (existingVote) {
    // if orignal vote clicked again then delete the vote
    if (existingVote.type === type) {
      await db.vote.delete({
        where: {
          userId_postId: {
            postId,
            userId: user.id,
          },
        },
      })

      return { message: `Removed your ${type.toLowerCase()}vote!` }
    }

    // otherwise if other than the orignal vote is clicked then update the vote
    await db.vote.update({
      where: {
        userId_postId: {
          postId,
          userId: user.id,
        },
      },
      data: {
        type,
      },
    })

    await cachePost(post, type)

    return { message: "Updated your vote!" }
  }

  // if no vote existed before
  await db.vote.create({
    data: {
      type,
      postId,
      userId: user.id,
    },
  })

  await cachePost(post, type)

  return { message: `Post ${type.toLowerCase()}voted` }
}

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
