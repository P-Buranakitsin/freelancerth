import { freelancerTypeOptions, gigTypeOptions, skillOptionsBasedOnType } from "@/constants/react-select";

describe('options', () => {
    describe('freelancerTypeOptions', () => {
        it('should have the proper length', () => {
            expect(freelancerTypeOptions.length).toBe(6);
        });

        it('should have the proper options', () => {
            expect(freelancerTypeOptions).toEqual([
                { value: "DEVELOPERS", label: "DEVELOPERS", isDisabled: false },
                { value: "DESIGNERS", label: "DESIGNERS", isDisabled: false },
                { value: "TESTERS", label: "TESTERS", isDisabled: false },
                { value: "PROJECT_MANAGERS", label: "PROJECT_MANAGERS", isDisabled: false },
                { value: "DEVOPS_ENGINEERS", label: "DEVOPS_ENGINEERS", isDisabled: false },
                { value: "BUSINESS_ANALYSTS", label: "BUSINESS_ANALYSTS", isDisabled: false },
            ]);
        });
    });

    describe('gigTypeOptions', () => {
        it('should have the proper length', () => {
            expect(gigTypeOptions.length).toBe(2);
        });

        it('should have the proper options', () => {
            expect(gigTypeOptions).toEqual([
                { value: "INDIVIDUAL", label: "INDIVIDUAL", isDisabled: false },
                { value: "TEAM", label: "TEAM", isDisabled: true },
            ]);
        });
    });

    describe('skillOptionsBasedOnType', () => {
        it('should have the proper length for DEVELOPERS', () => {
            expect(skillOptionsBasedOnType.DEVELOPERS.length).toBe(4);
        });

        it('should have the proper options for DEVELOPERS', () => {
            expect(skillOptionsBasedOnType.DEVELOPERS).toEqual([
                { value: "JAVASCRIPT", label: "JAVASCRIPT", isDisabled: false },
                { value: "PYTHON", label: "PYTHON", isDisabled: false },
                { value: "GOLANG", label: "GOLANG", isDisabled: false },
                { value: "JAVA", label: "JAVA", isDisabled: false },
            ]);
        });
    });
});
