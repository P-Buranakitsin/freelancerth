import { DescriptionSchema } from '@/models/Description'
import { expect } from '@jest/globals';

describe('DescriptionSchema', () => {
    it('should validate a valid object', () => {
        const validObject = {
            description: 'This description is valid'
        }
        expect(DescriptionSchema.safeParse(validObject).success).toBe(true)
    })

    it('should invalidate an object with too long description', () => {
        const invalidObject = {
            description: 'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
        }
        expect(DescriptionSchema.safeParse(invalidObject).success).toBe(false)
    })
})