import { NewUserSchema } from "@/models/NewUser";


describe('NewUserSchema', () => {
    it('should validate a valid new user object', () => {
        const newUser = {
            firstName: 'Pavaruth',
            lastName: 'Buranakitsin',
        };

        expect(() => NewUserSchema.parse(newUser)).not.toThrow();
    });

    it('should throw an error if first name is too short', () => {
        const invalidNewUser = {
            firstName: 'P',
            lastName: 'Buranakitsin',
        };

        expect(() => NewUserSchema.parse(invalidNewUser)).toThrow(
            'First name must be 2 or more characters long'
        );
    });

    it('should throw an error if last name is too short', () => {
        const invalidNewUser = {
            firstName: 'Pavaruth',
            lastName: 'B',
        };

        expect(() => NewUserSchema.parse(invalidNewUser)).toThrow(
            'Last name must be 2 or more characters long'
        );
    });
});