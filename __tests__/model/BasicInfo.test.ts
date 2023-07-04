import {expect} from '@jest/globals';
import { BasicInfoSchema } from '@/models/BasicInfo';

describe('BasicInfoSchema', () => {
  it('should validate a valid object', () => {
    const validObject = {
      firstName: 'James',
      lastName: 'Bond',
      email: 'james.bond@example.com'
    }
    expect(BasicInfoSchema.safeParse(validObject).success).toBe(true)
  })

  it('should invalidate an object with invalid email', () => {
    const invalidObject = {
      firstName: 'James',
      lastName: 'Bond',
      email: 'james.bond'
    }
    expect(BasicInfoSchema.safeParse(invalidObject).success).toBe(false)
  })

  it('should invalidate an object with too long first name', () => {
    const invalidObject = {
      firstName: 'JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ',
      lastName: 'Bond',
      email: 'james.bond@example.com'
    }
    expect(BasicInfoSchema.safeParse(invalidObject).success).toBe(false)
  })
})