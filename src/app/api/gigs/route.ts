import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";
import { CreateGig, CreateGigSchema } from "@/models/CreateGig";

export const GET = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in
    if (!token) {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }

    try {
        const url = new URL(req.url);
        const params = new URLSearchParams(url.search)

        const [total, data] = await prisma.$transaction([
            prisma.gig.count(),
            prisma.gig.findMany({
                include: {
                    searchTags: {
                        select: {
                            skillName: true
                        }
                    },
                },
            })
        ])


        const gigsWithSearchTagsAsStrings = data.map(gig => ({
            ...gig,
            searchTags: gig.searchTags.map(tag => tag.skillName)
        }))
        const paginationResponse = responses(gigsWithSearchTagsAsStrings, total).pagination
        return NextResponse.json(paginationResponse.body, paginationResponse.status)

    } catch (error) {
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}

export const POST = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in or not a freelancer
    if (!token?.sub || token.role !== "FREELANCER") {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }
    try {
        const freelancerProfile = await prisma.freelancerProfile.findUniqueOrThrow({
            where: {
                userId: token.sub,
            },
            include: {
                skills: {
                    select: {
                        skillName: true
                    }
                }
            }
        });
        const json = await req.json() as CreateGig;

        const response = CreateGigSchema.safeParse(json);
        if (!response.success) {
            const { errors } = response.error;

            const errorResponse = responses(errors).badRequest
            return NextResponse.json(errorResponse.body, errorResponse.status)
        }

        const skillObjects = json.skills.map(skill => ({ skillName: skill }));
        const gig = await prisma.gig.create({
            data: {
                price: json.gigPrice,
                type: json.gigType,
                description: json.gigDescription,
                freelancerProfileId: freelancerProfile.id,
                title: json.gigTitle,
                image: json.gigImage[0].fileUrl,
                searchTags: {
                    createMany: {
                        data: skillObjects as any
                    }
                }
            }
        })
        const successResponse = responses(gig).success
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