import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { responses } from "@/constants/responses";
import { getToken } from "next-auth/jwt";
import { EditGigSchemaAPI } from "@/models/EditGig";

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

export const PATCH = async (req: NextRequest, { params }: { params: { gigId: string } }) => {
    const token = await getToken({ req })

    const gig = await prisma.gig.findUnique({
        where: {
            id: params.gigId
        }
    })

    const freelancerProfile = await prisma.freelancerProfile.findUnique({
        where: {
            userId: token?.sub || ""
        }
    })

    // Not Signed in or not an admin trying to put others' gig
    if (!token || (token.role !== "ADMIN" && gig?.freelancerProfileId !== freelancerProfile?.id)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {
        const responseObject = await req.json() as IRequestPutGigByGigId

        const parsedResponse = EditGigSchemaAPI.safeParse(responseObject);
        if (!parsedResponse.success) {
            const { errors } = parsedResponse.error;

            const errorResponse = responses(errors).badRequest
            return NextResponse.json(errorResponse.body, errorResponse.status)
        }

        const gig = await prisma.gig.update({
            where: {
                id: params.gigId
            },
            data: {
                title: responseObject.title,
                description: responseObject.description,
                searchTags:
                    responseObject.searchTags ? {
                        deleteMany: {},
                        create: responseObject.searchTags.map(skillName => ({
                            skill: {
                                connectOrCreate: {
                                    where: { name: skillName },
                                    create: { name: skillName }
                                }
                            }
                        }))
                    } : undefined
                ,
                price: responseObject.price,
                image: responseObject.image,
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

export const DELETE = async (req: NextRequest, { params }: { params: { gigId: string } }) => {
    const token = await getToken({ req })

    const gig = await prisma.gig.findUnique({
        where: {
            id: params.gigId
        }
    })

    const freelancerProfile = await prisma.freelancerProfile.findUnique({
        where: {
            userId: token?.sub || ""
        }
    })

    // Not Signed in or not an admin trying to put others' gig
    if (!token || (token.role !== "ADMIN" && gig?.freelancerProfileId !== freelancerProfile?.id)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

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