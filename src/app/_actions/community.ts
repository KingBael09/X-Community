"use server"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"
import type { ZForm } from "@/lib/validators/community"

export async function createCommunityAction(data: ZForm) {
  const user = await getAuthSession()

  if (!user) {
    throw new Error("Unauthorized! Please login")
  }

  // Check if community already exists
  const communityExists = await db.community.findFirst({
    where: {
      name: data.name,
    },
  })

  if (communityExists) {
    throw new Error(`Community x/${data.name} already exists`)
  }

  // Create Community
  const newCommunity = await db.community.create({
    data: {
      name: data.name,
      creatorId: user.id,
    },
  })

  // Subscribe creator to his own community
  await db.subscription.create({
    data: {
      userId: user.id,
      communityId: newCommunity.id,
    },
  })

  return { id: newCommunity.id, name: newCommunity.name }
}

export interface SubscribeAction {
  communityId: string
}

export async function subscribeCommunityAction({
  communityId,
}: SubscribeAction) {
  const user = await getAuthSession()

  if (!user) {
    throw new Error("Unauthorized! Please login")
  }

  await db.subscription.create({
    data: {
      communityId,
      userId: user.id,
    },
  })
}

export async function unSubscribeCommunityAction({
  communityId,
}: SubscribeAction) {
  const user = await getAuthSession()

  if (!user) {
    throw new Error("Unauthorized! Please login")
  }

  const community = await db.community.findFirst({
    where: {
      id: communityId,
      creatorId: user.id,
    },
  })

  if (community) {
    throw new Error("You can't unsubscribe your own community")
  }

  await db.subscription.delete({
    where: {
      userId_communityId: {
        communityId,
        userId: user.id,
      },
    },
  })
}
