import { z } from 'zod'

export const KYCSchema = z.object({
    passportOrId: z.string().trim().min(5).max(300).optional(),
    resumeOrCV: z.string().trim().min(5).max(300).optional(),
})

export type KYC = z.infer<typeof KYCSchema>