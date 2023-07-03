"use server"

import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/session"
import type { ZUser } from "@/lib/validators/user"

export async function changeUsernameAction({ name }: ZUser) {
  const user = await getAuthSession()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const username = await db.user.findFirst({
    where: {
      username: name,
    },
  })

  if (username) {
    throw new Error("Username already taken")
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      username: name,
    },
  })
}
