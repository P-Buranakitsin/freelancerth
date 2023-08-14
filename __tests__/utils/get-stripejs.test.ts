import getStripe from '@/utils/get-stripejs';
import { loadStripe } from '@stripe/stripe-js';

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(),
}));

describe('getStripe', () => {
  it('should use the right key while calling loadStripe', async () => {
    await getStripe();
    expect(loadStripe).toHaveBeenCalledWith(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  });
});