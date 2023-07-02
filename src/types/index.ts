import type {
  Comment,
  Community,
  User as DBUser,
  Post,
  Prisma,
  Vote,
  VoteType,
} from "@prisma/client"
import type { AvatarProps } from "@radix-ui/react-avatar"
import type { User } from "next-auth"

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export interface LayoutProps {
  children: React.ReactNode
}

export interface ExtendedPost extends Post {
  community: Community
  votes: Vote[]
  author: DBUser
  comments: Comment[]
}

export interface PostProps {
  post: ExtendedPost
  votesAmt: number
  currentVote: Vote | undefined
}

export interface FeedProps {
  initialPosts: ExtendedPost[]
  communityName?: string
  user?: User | null
  isMainFeed?: boolean
}

export interface SubscribeAction {
  communityId: string
}

export interface CommunityPageProps {
  params: {
    slug: string
  }
}

export interface EditorProps {
  communityId: string
}

export interface EditorOutputProps {
  content: Prisma.JsonValue
}

export interface MiniCreatePostProps {
  user: User | null
}

export interface SubscribeLeaveToggleProps extends SubscribeAction {
  isSubscribed: boolean
  communityName: string
}

export interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">
}

export interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">
}

export interface PostVoteProps {
  postId: string
  initialVoteAmt: number
  initialVote?: VoteType | null
}
