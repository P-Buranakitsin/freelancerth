import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { responses } from "@/constants/responses";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {

    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: params.id,
            },
            include: {
                FreelancerProfile: {
                    select: {
                        bio: true,
                        githubURL: true,
                        linkedInURL: true,
                        portfolioURL: true,
                        skills: {
                            select: {
                                skillName: true,
                            }
                        },
                        type: true,
                        gigs: {
                            select: {
                                id: true,
                                title: true,
                                type: true,
                                description: true,
                                freelancerProfileId: true,
                                price: true,
                                image: true,
                                searchTags: {
                                    select: {
                                        skillName: true
                                    }
                                }
                            }
                        }
                    }
                },
                profile: {
                    select: {
                        city: true,
                        country: true,
                        description: true,
                    }
                }
            }
        })

        const successResponse = responses(user).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to patch another user
    if (!token || (token.role !== "ADMIN" && token.sub !== params.id)) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {
        const json = await req.json();

        const user = await prisma.user.update({
            where: {
                id: params.id
            },
            data: {
                name: json.name,
                image: json.fileUrl,
                role: json.role
            }
        })
        const successResponse = responses(user).success
        return NextResponse.json(successResponse.body, successResponse.status)

    } catch (error) {
        console.log(error)
        if (error instanceof SyntaxError) {
            const badRequestResponse = responses().badRequest;
            return NextResponse.json(
                badRequestResponse.body,
                badRequestResponse.status
            );
        }
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}