import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { responses } from "@/constants/responses";

export const GET = async (req: NextRequest, { params }: { params: { gigId: string } }) => {
    try {
        const gig = await prisma.gig.findUniqueOrThrow({
            where: {
                id: params.gigId
            },
            include: {
                searchTags: {
                    select: {
                        skillName: true
                    }
                },
                freelancerProfile: {
                    select: {
                        user: true,
                        type: true,
                        bio: true,
                    }
                }
            },
        })
        const searchTagsAsStrings = gig.searchTags.map((searchTag) => searchTag.skillName)

        const successResponse = responses({ ...gig, searchTags: searchTagsAsStrings }).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { gigId: string } }) => {
    try {
        const gig = await prisma.gig.delete({
            where: {
                id: params.gigId
            }
        })
        const successResponse = responses(gig).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}