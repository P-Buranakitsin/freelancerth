import { z } from 'zod'

// For back-end
export const CreateConnectedAccountSchemaAPI = z.object({
    stripAccountId: z.string().nonempty(),
    freelancerId: z.string().nonempty()
})

export type CreateConnectedAccountAPI = z.infer<typeof CreateConnectedAccountSchemaAPI>