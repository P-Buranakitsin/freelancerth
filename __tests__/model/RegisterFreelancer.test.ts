import { RegisterFreelancerSchema, RegisterFreelancerSchemaAPI } from '@/models/RegisterFreelancer';
import { FreelancerType, SkillName } from '@prisma/client';

describe('RegisterFreelancerSchema', () => {
    it('should validate a valid data', () => {
        const data = {
            profilePic: 'https://example.com/profile.jpg',
            firstName: 'Pavaruth',
            lastName: 'Buranakitsin',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            passportOrIdImage: [{ fileUrl: 'https://example.com/passport.jpg' }],
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT],
            resumeOrCV: [{ fileUrl: 'https://example.com/resume.pdf' }],
            linkedInURL: 'https://linkedin.com/in/example',
            githubURL: 'https://github.com/example',
            portfolioURL: 'https://example.com',
            term: true,
        };
        expect(RegisterFreelancerSchema.safeParse(data).success).toBe(true)
    });

    it('should throw an error if data is invalid', () => {
        const data = {
            profilePic: '',
            firstName: '',
            lastName: '',
            bio: '',
            passportOrIdImage: [],
            freelancerType: '',
            skills: [],
            resumeOrCV: [],
            linkedInURL: '',
            githubURL: '',
            portfolioURL: '',
            term: false,
        };
        expect(() => RegisterFreelancerSchema.parse(data)).toThrow();
    });

    it('should throw an error if some properties are missing', () => {
        const data = {
            profilePic: '',
            firstName: '',
            lastName: '',
            bio: '',
        };
        expect(() => RegisterFreelancerSchema.parse(data)).toThrow();
    });
});

describe('RegisterFreelancerSchemaAPI', () => {
    it('should validate a valid data', () => {
        const data = {
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            passportOrIdImage: [{ fileUrl: 'https://example.com/passport.jpg' }],
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT],
            resumeOrCV: [{ fileUrl: 'https://example.com/resume.pdf' }],
            linkedInURL: 'https://linkedin.com/in/example',
            githubURL: 'https://github.com/example',
            portfolioURL: 'https://example.com',
        };
        expect(RegisterFreelancerSchemaAPI.safeParse(data).success).toBe(true)
    });

    it('should throw an error if data is invalid', () => {
        const data = {
            bio: '',
            passportOrIdImage: [],
            freelancerType: '',
            skills: [],
            resumeOrCV: [],
            linkedInURL: '',
            githubURL: '',
            portfolioURL: '',
        };
        expect(() => RegisterFreelancerSchemaAPI.parse(data)).toThrow();
    });

    it('should throw an error if some properties are missing', () => {
        const data = {
            bio: '',
            passportOrIdImage: [],
            freelancerType: '',
            skills: [],
            resumeOrCV: [],
        };
        expect(() => RegisterFreelancerSchemaAPI.parse(data)).toThrow();
    });

    it('should validate a valid data even if there are additional properties', () => {
        const data = {
            firstName: 'Pavaruth',
            lastName: 'Buranakitsin',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            passportOrIdImage: [{ fileUrl: 'https://example.com/passport.jpg' }],
            freelancerType: FreelancerType.DEVELOPERS,
            skills: [SkillName.JAVASCRIPT],
            resumeOrCV: [{ fileUrl: 'https://example.com/resume.pdf' }],
            linkedInURL: 'https://linkedin.com/in/example',
            githubURL: 'https://github.com/example',
            portfolioURL: 'https://example.com',
        };
        expect(RegisterFreelancerSchemaAPI.safeParse(data).success).toBe(true)
    });
});
