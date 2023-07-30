import { SkillName } from '@prisma/client';
import { z } from 'zod'

export const SkillSchema = z.object({
    skills: z.nativeEnum(SkillName).array().nonempty({ message: "At least one skill must be selected" }),
})

export type Skill = z.infer<typeof SkillSchema>