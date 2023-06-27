import { z } from 'zod'

export const BasicInfoSchema = z.object({
    firstName: z
        .string().trim()
        .max(25).optional(),
    lastName: z
        .string().trim()
        .max(25).optional(),
    email: z.string().email().trim().optional()
})

export type BasicInfo = z.infer<typeof BasicInfoSchema>