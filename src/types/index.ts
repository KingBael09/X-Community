import type { Comment, Community, Post, User, Vote } from "@prisma/client"

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
  author: User
  comments: Comment[]
}
