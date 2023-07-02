import type { VoteType } from "@prisma/client"

export interface CachedPost {
  id: string
  title: string
  content: Prisma.JsonValue
  createdAt: Date
  authorUserName: string
  currentVote: VoteType | null
}
