import { FreelancerType, GigType } from '@prisma/client';
import { z } from 'zod'

export const CreateGigSchema = z.object({
    gigTitle: z
        .string().trim()
        .max(25).min(10),
    gigDescription: z
        .string().trim()
        .max(100).min(10),
    freelancerType: z.nativeEnum(FreelancerType),
    gigType: z.nativeEnum(GigType),
    skills: z.string().array().nonempty({message: "At least one skill must be selected"}),
    gigPrice: z.number().positive().min(1).max(1000),
    gigPhoto: z.any(),
})

export type CreateGig = z.infer<typeof CreateGigSchema>