import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in
    if (!token || token.sub !== params.userId) {
        return NextResponse.json(responses().unauthorized.body, responses().unauthorized.status)
    }

    try {
        const profile = await prisma.profile.findUnique({
            where: {
                userId: params.userId
            }
        })
        const successResponse = responses(profile).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }

}

export const PATCH = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in
    if (!token || token.sub !== params.userId) {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }

    try {

        const json = await req.json();
        // Create or update profile
        const profile = await prisma.profile.upsert({
            where: {
                userId: params.userId
            },
            update: {
                description: json.description,
                address: json.address,
                country: json.country,
                city: json.city,
                phoneNumber: json.phoneNumber,
                dob: json.dob,
                zip: json.zip,
            },
            create: {
                ...(token.sub && { userId: token.sub }),
                ...(json.description && { description: json.description }),
                ...(json.address && { address: json.address }),
                ...(json.country && { country: json.country }),
                ...(json.city && { city: json.city }),
                ...(json.phoneNumber && { phoneNumber: json.phoneNumber }),
                ...(json.dob && { dob: json.dob }),
                ...(json.zip && { zip: json.zip }),
            }
        })
        const successResponse = responses(profile).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}