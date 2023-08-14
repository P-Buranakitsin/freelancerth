
import { EditGigSchema, EditGigSchemaAPI } from '@/models/EditGig';
import { SkillName } from '@prisma/client';

describe('EditGigSchema', () => {
    it('should validate a valid input', () => {
        const input = {
            gigTitle: 'This is my first gig',
            gigDescription: 'This is ny gig descriptionnnnnnnnnnn',
            searchTags: [SkillName.JAVA],
            gigPrice: 10.99,
        };
        expect(EditGigSchema.safeParse(input).success).toBe(true);
    });

    it('should throw an error if gigTitle is invalid', () => {
        const input = {
            gigTitle: 'Th',
            gigDescription: 'This is ny gig descriptionnnnnnnnnnn',
            searchTags: [SkillName.JAVA],
            gigPrice: 10.99,
        };
        expect(() => EditGigSchema.parse(input)).toThrow();
    })

    it('should throw an error if gigDescription is invalid', () => {
        const input = {
            gigTitle: 'This is my first gig',
            gigDescription: 'Th',
            searchTags: [SkillName.JAVA],
            gigPrice: 10.99,
        };
        expect(() => EditGigSchema.parse(input)).toThrow();
    })

    it('should throw an error if searchTags are invalid', () => {
        const input = {
            gigTitle: 'This is my first gig',
            gigDescription: 'Th',
            searchTags: ['INVALID'],
            gigPrice: 10.99,
        };
        expect(() => EditGigSchema.parse(input)).toThrow();
    })

    it('should throw an error if gigPrice is invalid', () => {
        const input = {
            gigTitle: 'This is my first gig',
            gigDescription: 'Th',
            searchTags: ['INVALID'],
            gigPrice: -4.2323,
        };
        expect(() => EditGigSchema.parse(input)).toThrow();
    })
});

describe('EditGigSchemaAPI', () => {
    it('should validate a valid input', () => {
        const input = {
            title: 'This is my giggg',
            description: 'This is my descriptionnnnn',
            searchTags: [SkillName.GOLANG],
            price: 10.99,
        };
        expect(EditGigSchemaAPI.safeParse(input).success).toBe(true);
    });

    it('should throw an error if title is invalid', () => {
        const input = {
            title: 'Th',
            description: 'This is my descriptionnnnn',
            searchTags: [SkillName.GOLANG],
            price: 10.99,
        };
        expect(() => EditGigSchemaAPI.parse(input)).toThrow();
    })

    it('should throw an error if description is invalid', () => {
        const input = {
            title: 'This is my giggg',
            description: 'Th',
            searchTags: [SkillName.GOLANG],
            price: 10.99,
        };
        expect(() => EditGigSchemaAPI.parse(input)).toThrow();
    })

    it('should throw an error if searchTags are invalid', () => {
        const input = {
            title: 'This is my giggg',
            description: 'Th',
            searchTags: ['INVALID'],
            price: 10.99,
        };
        expect(() => EditGigSchemaAPI.parse(input)).toThrow();
    })

    it('should throw an error if searchTags are invalid', () => {
        const input = {
            title: 'This is my giggg',
            description: 'Th',
            searchTags: [SkillName.GOLANG],
            price: 1.2333,
        };
        expect(() => EditGigSchemaAPI.parse(input)).toThrow();
    })
});
