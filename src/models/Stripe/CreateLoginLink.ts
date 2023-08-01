import { z } from 'zod'

// For back-end
export const CreateLoginLinkSchemaAPI = z.object({
    accountId: z.string().nonempty(),
})

export type CreateLoginLinkAPI = z.infer<typeof CreateLoginLinkSchemaAPI>