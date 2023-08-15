import { CreateConnectedAccountAPI, CreateConnectedAccountSchemaAPI } from '@/models/Stripe/CreateConnectedAccount';

describe('CreateConnectedAccountSchemaAPI', () => {
  it('should validate a valid input', () => {
    const input: CreateConnectedAccountAPI = {
      stripAccountId: 'acct_123',
      freelancerId: 'freelancer_123'
    };
    expect(CreateConnectedAccountSchemaAPI.safeParse(input).success).toBe(true)
  });

  it('should throw an error for an invalid input', () => {
   const input: CreateConnectedAccountAPI = {
      stripAccountId: 'acct_123',
      freelancerId: ''
    };
    expect(() => CreateConnectedAccountSchemaAPI.parse(input)).toThrow();
  });
});
