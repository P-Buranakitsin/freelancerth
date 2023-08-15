import { CreateLoginLinkAPI, CreateLoginLinkSchemaAPI } from "@/models/Stripe/CreateLoginLink";

describe('CreateLoginLinkSchemaAPI', () => {
    it('should validate correct input', () => {
        const input: CreateLoginLinkAPI = {
            accountId: 'acct_123'
        };
        expect(CreateLoginLinkSchemaAPI.safeParse(input).success).toBe(true)
    });

    it('should throw an error for an invalid input', () => {
        const input = {
            accountId: ''
        };
        expect(() => CreateLoginLinkSchemaAPI.parse(input)).toThrow();
    });
});
