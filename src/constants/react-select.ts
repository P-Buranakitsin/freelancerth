import { Options } from "react-select";

export const freelancerTypeOptions: Options<FreelancerTypeOptionProps> = [
    { value: "DEVELOPERS", label: "DEVELOPERS", isDisabled: false },
    { value: "DESIGNERS", label: "DESIGNERS", isDisabled: false },
    { value: "TESTERS", label: "TESTERS", isDisabled: false },
    { value: "PROJECT_MANAGERS", label: "PROJECT_MANAGERS", isDisabled: false },
    { value: "DEVOPS_ENGINEERS", label: "DEVOPS_ENGINEERS", isDisabled: false },
    { value: "BUSINESS_ANALYSTS", label: "BUSINESS_ANALYSTS", isDisabled: false },
];

export const gigTypeOptions: Options<GigTypeOptionProps> = [
    { value: "INDIVIDUAL", label: "INDIVIDUAL", isDisabled: false },
    { value: "TEAM", label: "TEAM", isDisabled: true },
];

export const skillOptionsBasedOnType = {
    DEVELOPERS: [
        { value: "JAVASCRIPT", label: "JAVASCRIPT", isDisabled: false },
        { value: "PYTHON", label: "PYTHON", isDisabled: false },
        { value: "GOLANG", label: "GOLANG", isDisabled: false },
        { value: "JAVA", label: "JAVA", isDisabled: false },
    ],
    DESIGNERS: [
        { value: "PHOTOSHOP", label: "PHOTOSHOP", isDisabled: false },
        { value: "ILLUSTRATOR", label: "ILLUSTRATOR", isDisabled: false },
        { value: "FIGMA", label: "FIGMA", isDisabled: false },
    ],
    TESTERS: [
        { value: "POSTMAN", label: "POSTMAN", isDisabled: false },
        { value: "CYPRESS", label: "CYPRESS", isDisabled: false },
        { value: "JEST", label: "JEST", isDisabled: false },
    ],
    PROJECT_MANAGERS: [
        {
            value: "AGILE_METHODOLOGY",
            label: "AGILE_METHODOLOGY",
            isDisabled: false,
        },
        { value: "PROJECT_PLANNING", label: "PROJECT_PLANNING", isDisabled: false },
    ],
    DEVOPS_ENGINEERS: [
        { value: "DOCKER", label: "DOCKER", isDisabled: false },
        { value: "KUBERNETES", label: "KUBERNETES", isDisabled: false },
    ],
    BUSINESS_ANALYSTS: [
        {
            value: "REQUIREMENTS_ANALYSIS",
            label: "REQUIREMENTS_ANALYSIS",
            isDisabled: false,
        },
        { value: "DATA_ANALYSIS", label: "DATA_ANALYSIS", isDisabled: false },
    ],
};