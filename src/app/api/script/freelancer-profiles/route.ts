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
        const freelancerProfile = await prisma.freelancerProfile.create({
            data: {
                userId: token.sub,
                type: 'DEVELOPERS',
                verified: true,
                bio: "tttttt",
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

export const DELETE = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin
    if (!token?.sub) {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }
    try {
        const freelancerProfile = await prisma.freelancerProfile.deleteMany({})
        const successResponse = responses(freelancerProfile).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}