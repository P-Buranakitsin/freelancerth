import { z } from 'zod'

export const NewUserSchema = z.object({
    firstName: z
        .string().trim()
        .min(2, { message: "First name must be 2 or more characters long" }),
    lastName: z
        .string().trim()
        .min(2, { message: "Last name must be 2 or more characters long" })
})

export type NewUser = z.infer<typeof NewUserSchema>