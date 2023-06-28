import { z } from 'zod'

export const MoreInfoSchema = z.object({
    address: z
        .string().trim()
        .max(70).optional(),
    country: z.string().trim().max(25).optional(),
    city: z.string().trim().max(25).optional(),
    phoneNumber: z.string().trim().max(15).optional(),
    dob: z.coerce.date().refine((data) => data < new Date(), { message: "Birthday must not be in the future" }).optional(),
    zip: z.string().trim().max(10).optional(),
})

export type MoreInfo = z.infer<typeof MoreInfoSchema>