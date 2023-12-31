import { FreelancerType, GigType, SkillName } from '@prisma/client';
import { z } from 'zod'

export const CreateGigSchema = z.object({
    gigTitle: z
        .string().trim()
        .max(50).min(10),
    gigDescription: z
        .string().trim()
        .max(150).min(10),
    gigType: z.nativeEnum(GigType),
    freelancerType: z.nativeEnum(FreelancerType).optional(),
    skills: z.nativeEnum(SkillName).array().nonempty({ message: "At least one skill must be selected" }),
    gigPrice: z.number().positive().min(1).max(1000).multipleOf(0.01),
    gigImage: z.any().array().min(1).max(1),
})

export type CreateGig = z.infer<typeof CreateGigSchema>