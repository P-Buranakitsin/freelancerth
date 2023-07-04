import { MoreInfoSchema } from '@/models/MoreInfo'
import { expect } from '@jest/globals';

describe('MoreInfoSchema', () => {
    it('should validate a valid object', () => {
        const validObject = {
            address: 'Argyle Street',
            country: 'UK',
            city: 'Glasgow',
            phoneNumber: '00000-000000',
            dob: new Date('1997-01-01'),
            zip: '12345'
        }
        expect(MoreInfoSchema.safeParse(validObject).success).toBe(true)
    })

    it('should invalidate an object with too long address', () => {
        const invalidObject = {
            address: 'Tooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
            country: 'UK',
            city: 'Glasgow',
            phoneNumber: '00000-000000',
            dob: new Date('1997-01-01'),
            zip: '12345'
        }
        expect(MoreInfoSchema.safeParse(invalidObject).success).toBe(false)
    })

    it('should invalidate an object with future date of birth', () => {
        const invalidObject = {
            address: 'Argyle Street',
            country: 'UK',
            city: 'Glasgow',
            phoneNumber: '00000-000000',
            dob: new Date('2100-01-01'),
            zip: '12345'
        }
        expect(MoreInfoSchema.safeParse(invalidObject).success).toBe(false)
    })
})