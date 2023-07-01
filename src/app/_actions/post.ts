"use server"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"
import type { ZPost } from "@/lib/validators/post"

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

export async function upVotePostAction() {}
export async function downVotePostAction() {}
