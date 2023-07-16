import { CreateGigSchema } from '@/models/CreateGig';
import { SkillName, FreelancerType, GigType } from '@prisma/client';
describe('CreateGigSchema', () => {

    it('throws an error for a gig with a title that is too short', () => {
        const invalidGig = {
            gigTitle: 'Gig',
            gigDescription: 'This is my gig description',
            gigType: GigType.INDIVIDUAL,
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT],
            gigPrice: 9.99,
            gigImage: [{ fileUrl: "" }],
        };

        expect(() => CreateGigSchema.parse(invalidGig)).toThrow('String must contain at least 10 character(s)');
    });

    it('throws an error for a gig with a description that is too short', () => {
        const invalidGig = {
            gigTitle: 'I will create your website using Next.js',
            gigDescription: 'des',
            gigType: GigType.INDIVIDUAL,
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT],
            gigPrice: 9.99,
            gigImage: [{ fileUrl: "" }],
        };

        expect(() => CreateGigSchema.parse(invalidGig)).toThrow('String must contain at least 10 character(s)');
    });

    it('throws an error for a gig with an invalid gig type', () => {
        const invalidGig = {
            gigTitle: 'I will create your website using Next.js',
            gigDescription: 'This is gigs description',
            gigType: "INVALID",
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT],
            gigPrice: 9.99,
            gigImage: [{ fileUrl: "" }],
        };

        expect(() => CreateGigSchema.parse(invalidGig)).toThrow("Invalid enum value. Expected 'INDIVIDUAL' | 'TEAM', received 'INVALID'");
    });

    it('throws an error for a gig with an invalid freelancer type', () => {
        const invalidGig = {
            gigTitle: 'I will create your website using Next.js',
            gigDescription: 'This is gigs description',
            gigType: GigType.INDIVIDUAL,
            freelancerType: "INVALID",
            skills: [SkillName.JAVASCRIPT],
            gigPrice: 9.99,
            gigImage: [{ fileUrl: "" }],
        };

        expect(() => CreateGigSchema.parse(invalidGig)).toThrow("Invalid enum value. Expected 'DEVELOPERS' | 'DESIGNERS' | 'TESTERS' | 'PROJECT_MANAGERS' | 'DEVOPS_ENGINEERS' | 'BUSINESS_ANALYSTS', received 'INVALID'");
    });

    it('throws an error for a gig with an invalid skills', () => {
        const invalidGig = {
            gigTitle: 'I will create your website using Next.js',
            gigDescription: 'This is gigs description',
            gigType: GigType.INDIVIDUAL,
            freelancerType: FreelancerType.DEVELOPERS,
            skills: ["INVALID"],
            gigPrice: 9.99,
            gigImage: [{ fileUrl: "" }],
        };

        expect(() => CreateGigSchema.parse(invalidGig)).toThrow("Invalid enum value. Expected 'JAVASCRIPT' | 'JAVA' | 'PYTHON' | 'GOLANG' | 'PHOTOSHOP' | 'ILLUSTRATOR' | 'FIGMA' | 'POSTMAN' | 'CYPRESS' | 'JEST' | 'AGILE_METHODOLOGY' | 'PROJECT_PLANNING' | 'DOCKER' | 'KUBERNETES' | 'REQUIREMENTS_ANALYSIS' | 'DATA_ANALYSIS', received 'INVALID'");
    });

    it('throws an error for a gig with an invalid gig price', () => {
        const invalidGig = {
            gigTitle: 'I will create your website using Next.js',
            gigDescription: 'This is gigs description',
            gigType: GigType.INDIVIDUAL,
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT, SkillName.JAVA],
            gigPrice: 9.999,
            gigImage: [{ fileUrl: "" }],
        };

        expect(() => CreateGigSchema.parse(invalidGig)).toThrow("Number must be a multiple of 0.01");
    });

    it('throws an error for a gig with an empty gig image', () => {
        const invalidGig = {
            gigTitle: 'I will create your website using Next.js',
            gigDescription: 'This is gigs description',
            gigType: GigType.INDIVIDUAL,
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT, SkillName.JAVA],
            gigPrice: 9.99,
            gigImage: [],
        };

        expect(() => CreateGigSchema.parse(invalidGig)).toThrow("Array must contain at least 1 element(s)");
    });

    it('should validate a valid gig', () => {
        const invalidGig = {
            gigTitle: 'I will create your website using Next.js',
            gigDescription: 'This is gigs description',
            gigType: GigType.INDIVIDUAL,
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT, SkillName.JAVA],
            gigPrice: 9.99,
            gigImage: [{ fileUrl: "" }],
        };

        expect(CreateGigSchema.safeParse(invalidGig).success).toBe(true)
    });
});
