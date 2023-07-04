export const endpoints = {
    userById: (id: string) => `/api/users/${id}`,
    profileByUserId: (userId: string) => `/api/profiles/${userId}`
}