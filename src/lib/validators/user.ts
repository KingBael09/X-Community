import { z } from "zod"

export const UserNameFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Uername must be atleast one character long" })
    .max(20, { message: "Username must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username must be alphanumeric with underscores",
    }),
})

export type ZUser = z.infer<typeof UserNameFormSchema>
