import { INFINITE_SCROLLING_PAGENATION_RESULTS } from "@/config"
import type { User } from "next-auth"

import { db } from "@/lib/db"

import PostFeed from "./postFeed"

export async function GeneralFeed() {
  const post = await db.post.findMany({
    take: INFINITE_SCROLLING_PAGENATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
  })

  return <PostFeed initialPosts={post} isMainFeed />
}

interface PersonalFeedProps {
  user: User
}

export async function PersonalFeed({ user }: PersonalFeedProps) {
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: user.id,
    },
    include: {
      community: true,
    },
  })

  const followedCommunitesIds: string[] = []

  followedCommunities.forEach(({ communityId }) =>
    followedCommunitesIds.push(communityId)
  )

  const post = await db.post.findMany({
    where: {
      community: {
        name: {
          in: followedCommunitesIds,
        },
      },
    },
    take: INFINITE_SCROLLING_PAGENATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
  })

  return <PostFeed initialPosts={post} user={user} isMainFeed />
}
