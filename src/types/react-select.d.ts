type GigType = import('@prisma/client').GigType;

declare interface FreelancerTypeOptionProps {
    value: FreelancerType;
    label: FreelancerType;
    isDisabled: boolean;
}

declare interface GigTypeOptionProps {
    value: GigType;
    label: GigType;
    isDisabled: boolean;
}

declare interface StartingOptionProps {
    value: "CHEAP" | "NORMAL" | "EXPENSIVE";
    label: string;
    isDisabled: boolean;
}

declare interface SkillOptions {
    DEVELOPERS: SkillOptionProps<"JAVASCRIPT" | "JAVA" | "PYTHON" | "GOLANG">[]
    DESIGNERS: SkillOptionProps<"PHOTOSHOP" | "ILLUSTRATOR" | "FIGMA">[]
    TESTERS: SkillOptionProps<"POSTMAN" | "CYPRESS" | "JEST">[]
    PROJECT_MANAGERS: SkillOptionProps<"AGILE_METHODOLOGY" | "PROJECT_PLANNING">[]
    DEVOPS_ENGINEERS: SkillOptionProps<"DOCKER" | "KUBERNETES">[] 
    BUSINESS_ANALYSTS: SkillOptionProps<"REQUIREMENTS_ANALYSIS" | "DATA_ANALYSIS">[]
}

declare interface SkillOptionProps<T> {
    value: T;
    label: T;
    isDisabled: boolean;
}
