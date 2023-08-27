import { SigninSchema } from "@/models/Signin";


describe('SigninSchema', () => {
    it('should validate a valid data', () => {
        const data = {
            email: 'example@freelancerth.com',
        };
        expect(SigninSchema.safeParse(data).success).toBe(true)
    });

    it('should throw an error with invalid data', () => {
        const data = {
            email: 'invalid',
        };
        expect(() => SigninSchema.parse(data)).toThrow();
    });
});