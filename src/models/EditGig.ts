import { SkillName } from '@prisma/client';
import { z } from "zod";


export const EditGigSchema = z.object({
    gigTitle: z
        .string().trim()
        .max(50).min(10),
    gigDescription: z
        .string().trim()
        .max(150).min(10),
    searchTags: z.nativeEnum(SkillName).array(),
    gigPrice: z.number().positive().min(1).max(1000).multipleOf(0.01),
})

export const EditGigSchemaAPI = z.object({
    title: z
        .string().trim()
        .max(50).min(10).optional(),
    description: z
        .string().trim()
        .max(150).min(10).optional(),
    searchTags: z.nativeEnum(SkillName).array().nonempty({ message: "At least one skill must be selected" }).optional(),
    price: z.number().positive().min(1).max(1000).multipleOf(0.01).optional(),
    image: z
        .string().trim().optional(),
})

export type EditGig = z.infer<typeof EditGigSchema>
export type EditGigAPI = z.infer<typeof EditGigSchemaAPI>