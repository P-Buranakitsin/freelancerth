import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to get another profile
    if (!token || (token.role !== "ADMIN" && token.sub !== params.userId)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {
        const freelancerProfile = await prisma.freelancerProfile.findUnique({
            where: {
                userId: params.userId,
            },
            include: {
                skills: true,
            },
        });
        if (!freelancerProfile) {
            throw new Error("not found")
        }
        const skillNames = freelancerProfile.skills.map((skill) => skill.skillName);
        const responseData = {
            ...freelancerProfile,
            skills: skillNames,
        };
        const successResponse = responses(responseData).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}