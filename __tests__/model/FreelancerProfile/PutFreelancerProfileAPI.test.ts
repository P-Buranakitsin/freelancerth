import { PutFreelancerProfileSchema } from '@/models/FreelancerProfile/PutFreelancerProfileAPI';
import { SkillName } from '@prisma/client';

describe('PutFreelancerProfileSchema', () => {
    it('should validate a valid input', () => {
        const input = {
            bio: 'Experienced React Developer',
            passportOrId: 'https://example.com/passport.pdf',
            resumeOrCV: 'https://example.com/resume.pdf',
            linkedInURL: 'https://www.linkedin.com/in/pavaruth.b',
            githubURL: 'https://github.com/pavaruth.b',
            portfolioURL: 'https://example.com/portfolio',
            skills: [SkillName.JAVASCRIPT, SkillName.PYTHON],
            verified: true
        }

        expect(PutFreelancerProfileSchema.safeParse(input).success).toBe(true)
    });

    it('should throw an error for an invalid input', () => {
        const input = {
            bio: 'Experienced React Developer',
            passportOrId: 'https://example.com/passport.pdf',
            resumeOrCV: 'https://example.com/resume.pdf',
            linkedInURL: 'https://www.linkedin.com/in/pavaruth.b',
            githubURL: 'https://github.com/pavaruth.b',
            portfolioURL: 'https://example.com/portfolio',
            skills: ['INVALID'],
            verified: true
        }

        expect(() => PutFreelancerProfileSchema.parse(input)).toThrow();
    });
});
