import Link from "next/link"
import { notFound } from "next/navigation"
import type { LayoutProps } from "@/types"
import { format } from "date-fns"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"
import { buttonVariants } from "@/components/ui/button"
import { SubscribeLeaveToggle } from "@/components/subscribeLeaveToggle"

export interface CommunityPageProps {
  params: {
    slug: string
  }
}

export default async function Layout({
  children,
  params,
}: LayoutProps & CommunityPageProps) {
  const user = await getAuthSession()

  const community = await db.community.findFirst({
    where: {
      name: params.slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  if (!community) return notFound()

  const subscription = !user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          community: {
            name: params.slug,
          },
          user: {
            id: user.id,
          },
        },
      })

  const isSubscribed = !!subscription

  const memberCount = await db.subscription.count({
    where: {
      community: {
        name: params.slug,
      },
    },
  })

  return (
    <div className="mx-auto h-full max-w-7xl pt-12 sm:container">
      <div>
        {/* Button to take us back */}
        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
          <div className="col-span-2 flex flex-col space-y-6">{children}</div>
          <div className="order-first hidden h-fit overflow-hidden rounded-lg border border-accent md:order-last md:block">
            <div className="px-6 py-4">
              <p className="py-3 font-semibold">About x/{community.name}</p>
            </div>
            <dl className="divide-y divide-accent bg-background px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="text-muted-foreground">
                  <time dateTime={community.createdAt.toDateString()} />
                  {format(community.createdAt, "MMMM d, yyyy")}
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-muted-foreground">Members</dt>
                <dd className="text-muted-foreground">
                  <span>{memberCount}</span>
                </dd>
              </div>
              {community.creatorId === user?.id && (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-muted-foreground">
                    You created this community
                  </p>
                </div>
              )}
              {/* This is because the creator should not be allowed to leave his own community */}
              {community.creatorId !== user?.id && (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  communityId={community.id}
                  communityName={community.name}
                />
              )}
              <Link
                href={`/x/${params.slug}/submit`}
                className={buttonVariants({
                  variant: "secondary",
                  className: "w-full mb-6",
                })}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
