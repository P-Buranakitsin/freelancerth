import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";
import { RegisterFreelancer, RegisterFreelancerSchema } from "@/models/RegisterFreelancer";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in 
    if (!token?.sub) {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }

    try {
        // If freelancer profile exists, throw an error
        const existingFreelancerProfile = await prisma.freelancerProfile.findUnique({
            where: {
                userId: token.sub,
            },
        })
        if (existingFreelancerProfile) {
            const errorResponse = responses().conflict
            return NextResponse.json(errorResponse.body, errorResponse.status)
        }

        const json = await req.json() as RegisterFreelancer

        const response = RegisterFreelancerSchema.safeParse(json);
        if (!response.success) {
            const { errors } = response.error;

            const errorResponse = responses(errors).badRequest
            return NextResponse.json(errorResponse.body, errorResponse.status)
        }

        const freelancerProfile = await prisma.freelancerProfile.create({
            data: {
                type: json.freelancerType,
                verified: false,
                bio: json.bio,
                githubURL: json.githubURL,
                linkedInURL: json.linkedInURL,
                passportOrId: json.passportOrIdImage[0].fileUrl,
                portfolioURL: json.portfolioURL,
                resumeOrCV: json.resumeOrCV[0].fileUrl,
                userId: token.sub,
                skills: {
                    create: json.skills.map(skillName => ({
                        skill: {
                            connectOrCreate: {
                                where: { name: skillName },
                                create: { name: skillName }
                            }
                        }
                    }))
                }
            }
        })
        const successResponse = responses(freelancerProfile).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }

}