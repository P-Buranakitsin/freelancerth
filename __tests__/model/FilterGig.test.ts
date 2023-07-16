import { FilterGigSchema } from '@/models/FilterGig';
import { FreelancerType, GigType, SkillName } from '@prisma/client';

describe('FilterGigSchema', () => {
    it('should validate a valid filter gig', () => {
        const filterGig = {
            gigTitle: 'My First Gig',
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT, SkillName.JAVA],
            gigType: GigType.INDIVIDUAL,
            startingPrice: 'CHEAP',
        };

        expect(FilterGigSchema.safeParse(filterGig).success).toBe(true)
    });

    it('should validate a filter gig object with missing optional fields', () => {
        const filterGig = {
            gigTitle: 'My First Gig',
        };

        expect(FilterGigSchema.safeParse(filterGig).success).toBe(true)
    });

    it('should validate an empty filter gig object', () => {
        const filterGig = {};

        expect(FilterGigSchema.safeParse(filterGig).success).toBe(true)
    });

    it('should throw an error if freelancer type is invalid', () => {
        const filterGig = {
            gigTitle: 'My First Gig',
            freelancerType: 'INVALID',
        };

        expect(() => FilterGigSchema.parse(filterGig)).toThrow();
    });

    it('should throw an error if skills are invalid', () => {
        const filterGig = {
            gigTitle: 'My First Gig',
            skills: ["INVALID"]
        };

        expect(() => FilterGigSchema.parse(filterGig)).toThrow();
    });

    it('should throw an error if gig type is invalid', () => {
        const filterGig = {
            gigTitle: 'My First Gig',
            gigType: "INVALID"
        };

        expect(() => FilterGigSchema.parse(filterGig)).toThrow();
    });

    it('should throw an error if starting price is invalid', () => {
        const filterGig = {
            gigTitle: 'My First Gig',
            startingPrice: "INVALID"
        };

        expect(() => FilterGigSchema.parse(filterGig)).toThrow();
    });
});
