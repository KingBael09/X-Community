import type { Prisma } from "@prisma/client"
import { z, ZodError } from "zod"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"

const URLSchema = z.object({
  limit: z.string(), //because it comes as string
  page: z.string(),
  communityName: z.string().nullish().optional(),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const user = await getAuthSession()

  const followedCommunitiesIds: string[] = []

  if (user) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: user.id,
      },
    })

    followedCommunities.forEach(({ communityId }) =>
      followedCommunitiesIds.push(communityId)
    )
  }

  try {
    const { limit, page, communityName } = URLSchema.parse({
      limit: url.searchParams.get("limit"),
      page: url.searchParams.get("page"),
      communityName: url.searchParams.get("communityName"),
    })

    let whereClause: Prisma.PostWhereInput = {}

    if (communityName) {
      whereClause = {
        community: {
          name: communityName,
        },
      }
    } else if (user) {
      whereClause = {
        community: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }
    // TODO: This could break in prisma 5
    const numLimit = parseInt(limit)
    const numPage = parseInt(page)

    const post = await db.post.findMany({
      take: numLimit,
      skip: (numPage - 1) * numLimit, //skip previously gotton pages
      orderBy: {
        createdAt: "desc",
      },
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })

    return new Response(JSON.stringify(post))
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Invalid GET request data", { status: 422 })
    }

    return new Response("Could not fetch posts", { status: 500 })
  }
}
