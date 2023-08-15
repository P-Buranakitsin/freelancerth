import { FreelancerProfileSchema } from '@/models/FreelancerProfile/FreelancerProfile';
import { SkillName } from '@prisma/client';

describe('FreelancerProfileSchema', () => {
    it('should validate a valid input', () => {
        const input = {
            id: '234',
            name: 'Pavaruth Buranakitsin',
            type: 'DEVELOPER',
            skills: [SkillName.JAVASCRIPT, SkillName.PYTHON],
            bio: 'Experienced React Developer',
            resumeOrCV: 'https://example.com/resume.pdf',
            linkedInURL: 'https://www.linkedin.com/in/pavaruth.b',
            githubURL: 'https://github.com/pavaruth.b',
            portfolioURL: 'https://example.com/portfolio'
        };

        expect(FreelancerProfileSchema.safeParse(input).success).toBe(true)
    });

    it('should throw an error for an invalid input', () => {
        const input = {
            id: 234,
            name: 'Pavaruth Buranakitsin',
            type: 'DEVELOPER',
            skills: [SkillName.JAVASCRIPT, SkillName.PYTHON],
            bio: 'Experienced React Developer',
            resumeOrCV: 'https://example.com/resume.pdf',
            portfolioURL: 'https://example.com/portfolio'
        };

        expect(() => FreelancerProfileSchema.parse(input)).toThrow();
    });
});
