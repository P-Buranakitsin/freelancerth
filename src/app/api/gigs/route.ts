import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";
import { CreateGig } from "@/models/CreateGig";

export const POST = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin
    if (!token?.sub) {
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
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }

}