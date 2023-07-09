type FreelancerType = import('@prisma/client').FreelancerType;
declare interface IResponseDataPATCHUserById {
    message: string
    data: {
        email: string
        emailVerified: string
        id: string
        image: string | null
        name: string
        role: FreelancerType
    }
}