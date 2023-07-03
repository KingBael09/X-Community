"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "@/ui/separator"
import { type Community, type Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import debounce from "lodash.debounce"

import { useOnClickOutside } from "@/hooks/use-on-click-outside"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import { Icons } from "./util/icons"

type CastType = Community & {
  _count: Prisma.CommunityCountOutputType
}

export function SearchBar() {
  const pathname = usePathname()
  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const req = await fetch(`/api/search?q=${input}`, { method: "GET" })
      const res = (await req.json()) as CastType[]

      return res
    },
    queryKey: ["search-query"],
    enabled: false,
  })

  const request = debounce(async () => {
    await refetch()
  }, 400)

  const debounceRequest = useCallback(() => {
    void request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useOnClickOutside(commandRef, () => {
    setInput("")
  })

  useEffect(() => {
    setInput("")
  }, [pathname])

  return (
    <Command
      ref={commandRef}
      className="relative max-w-lg overflow-visible rounded-lg border"
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        placeholder="Search Communites..."
        className="border-none outline-none focus:border-none focus:outline-none"
      />
      {input.length > 0 && (
        <CommandList className="absolute inset-x-0 top-full rounded-b-md border border-accent bg-background shadow">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((community, i) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/x/${e}`)
                    router.refresh()
                  }}
                  key={community.id}
                  value={community.name}
                >
                  <Icons.bird className="mr-2 h-4 w-4" />
                  <Link className="w-full" href={`/x/${community.name}`}>
                    x/{community.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  )
}
