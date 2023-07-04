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

export const PUT = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to put another user
    if (!token || (token.role !== "ADMIN" && token.sub !== params.userId)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {

        const json = await req.json();
        // Find user with id equals to params.userId
        const user = await prisma.user.findUnique({
            where: {
                id: params.userId
            }
        })
        // If user not found, return an error
        if (!user) {
            const notfoundResponse = responses('user').notFoundError
            return NextResponse.json(notfoundResponse.body, notfoundResponse.status)
        }
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
                userId: params.userId,
                description: json.description,
                address: json.address,
                country: json.country,
                city: json.city,
                phoneNumber: json.phoneNumber,
                dob: json.dob,
                zip: json.zip,
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