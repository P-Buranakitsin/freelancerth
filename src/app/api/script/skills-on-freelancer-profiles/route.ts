import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";

export const POST = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin
    if (!token?.sub) {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }
    try {
        const freelancerProfile = await prisma.freelancerProfile.findUnique({
            where: {
                userId: token.sub
            }
        })
        console.log(freelancerProfile)
        if (!freelancerProfile) {
            throw new Error('freelancer profile not found!')
        }
        const skillsOnFreelancerProfiles = await prisma.skillsOnFreelancerProfiles.createMany({
            data: [{
                freelancerProfileId: freelancerProfile.id,
                skillName: "JAVA"
            }, {
                freelancerProfileId: freelancerProfile.id,
                skillName: "PYTHON"
            }, {
                freelancerProfileId: freelancerProfile.id,
                skillName: "GOLANG"
            }]
        })
        const successResponse = responses(skillsOnFreelancerProfiles).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }

}