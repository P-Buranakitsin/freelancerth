export const endpoints = {
    userById: (id: string) => `/api/users/${id}`,
    profileByUserId: (userId: string) => `/api/profiles/${userId}`,
    freelancerProfileSkillsByUserId: (userId: string) => `/api/freelancer-profiles/${userId}/skills`
}