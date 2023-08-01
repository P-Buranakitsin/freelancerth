import { z } from 'zod'

// For back-end
export const WithdrawSchemaAPI = z.object({
    accountId: z.string().nonempty(),
    amount: z.string().nonempty(),
    freelancerId: z.string().nonempty(),
})

export type WithdrawAPI = z.infer<typeof WithdrawSchemaAPI>