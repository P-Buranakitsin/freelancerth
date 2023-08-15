import { WithdrawAPI, WithdrawSchemaAPI } from "@/models/Stripe/Withdraw";

describe('WithdrawSchemaAPI', () => {
    it('should validate correct input', () => {
        const input: WithdrawAPI = {
            accountId: 'acct_123',
            amount: '9.99',
            freelancerId: 'freelancer_123'
        };
        expect(WithdrawSchemaAPI.safeParse(input).success).toBe(true)
    });

    it('should throw an error for an invalid input', () => {
        const data = {
            accountId: '',
            amount: '',
            freelancerId: ''
        };
        expect(() => WithdrawSchemaAPI.parse(data)).toThrow();
    });
});
