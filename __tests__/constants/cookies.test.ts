import { DEV_ACCESS_TOKEN, PROD_ACCESS_TOKEN } from "@/constants/cookies";


describe('constants', () => {
    it('should return the appropriate DEV_ACCESS_TOKEN value', () => {
        expect(DEV_ACCESS_TOKEN).toEqual('next-auth.session-token');
    });

    it('should return the appropriate PROD_ACCESS_TOKEN value', () => {
        expect(PROD_ACCESS_TOKEN).toEqual('__Secure-next-auth.session-token');
    });
});