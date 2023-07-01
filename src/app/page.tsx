import Link from "next/link"
import { buttonVariants } from "@/ui/button"
import { Icons } from "@/util/icons"

import { siteConfig } from "@/config/site"

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold md:text-4xl">Your Feed</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {/* feed */}
        {/* subreddit */}
        <div className="order-first h-fit overflow-hidden rounded-lg border border-accent md:order-last">
          <div className="bg-accent px-6 py-4 ">
            {/* <div className="bg-emerald-100 px-6 py-4 dark:bg-emerald-700"> */}
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <Icons.home className="h-4 w-4" />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-accent px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-muted-foreground">
                Your personal {siteConfig.name} homepage. Come here to check in
                with your favorite communities
              </p>
            </div>
            <Link
              href="/x/create"
              className={buttonVariants({ className: "w-full mt-4 mb-6" })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
