import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";
import { CreateGig, CreateGigSchema } from "@/models/CreateGig";
import { FreelancerType, Prisma } from "@prisma/client";

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const params = new URLSearchParams(url.search)

        // Query params
        const page = Number(params.get("page")) || 0
        const limit = Number(params.get("limit")) || 6
        const title = (params.get("title")) || ''
        const freelancerType = params.get("freelancerType") || undefined;
        const skills = params.getAll("skills") || undefined;
        const price = params.get("price") || undefined;
        const freelancerProfileId = params.get("freelancerProfileId") || undefined;

        const whereCondition: Prisma.GigWhereInput = {};

        if (title) {
            whereCondition.title = {
                contains: title
            }
        }

        if (freelancerType) {
            whereCondition.freelancerProfile = {
                type: {
                    equals: freelancerType as FreelancerType
                }
            }
        }

        if (skills && skills.length > 0) {
            whereCondition.searchTags = {
                some: {
                    skillName: {
                        in: skills as SkillName[]
                    }
                }
            };
        }

        if (price) {
            if (price === "CHEAP") {
                whereCondition.price = {
                    lt: 19.99
                }
            } else if (price === "NORMAL") {
                whereCondition.price = {
                    gte: 19.99,
                    lte: 99.99,
                }
            } else if (price === "EXPENSIVE") {
                whereCondition.price = {
                    gt: 99.99
                }
            }
        }

        if (freelancerProfileId) {
            whereCondition.freelancerProfileId = freelancerProfileId
        }

        const [totalItems, data] = await prisma.$transaction([
            prisma.gig.count({
                where: whereCondition
            }),
            prisma.gig.findMany({
                where: whereCondition,
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
                skip: page * limit,
                take: limit,
            })
        ])

        const pageCount = Math.ceil(totalItems / limit);

        const gigsWithSearchTagsAsStrings = data.map(gig => ({
            ...gig,
            searchTags: gig.searchTags.map(tag => tag.skillName)
        }))
        const paginationResponse = responses(gigsWithSearchTagsAsStrings, {
            limit,
            totalItems,
            totalPages: pageCount,
            page,
        }).pagination
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