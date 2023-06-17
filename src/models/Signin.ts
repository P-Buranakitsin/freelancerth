import { z } from 'zod'

export const SigninSchema = z.object({
    email: z.string().email().trim()
})

export type Signin = z.infer<typeof SigninSchema>