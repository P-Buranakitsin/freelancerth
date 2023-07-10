import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";

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
        const gigs = await prisma.gig.createMany({
            data: [{
                price: 119.99,
                type: "INDIVIDUAL",
                description: "Premium Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Premium Gig",
                image: "",
            }, {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            }, {
                price: 20.99,
                type: "INDIVIDUAL",
                description: "Normal Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Normal Gig",
                image: "",
            }, {
                price: 20.99,
                type: "INDIVIDUAL",
                description: "Normal Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Normal Gig",
                image: "",
            }, {
                price: 20.99,
                type: "INDIVIDUAL",
                description: "Normal Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Normal Gig",
                image: "",
            },
            {
                price: 20.99,
                type: "INDIVIDUAL",
                description: "Normal Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Normal Gig",
                image: "",
            }, {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            },
            {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            },
            {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            },
            {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            },
            {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            }, {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            }, {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            }, {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            }, {
                price: 5.99,
                type: "INDIVIDUAL",
                description: "Cheap Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Cheap Gig",
                image: "",
            }, {
                price: 119.99,
                type: "INDIVIDUAL",
                description: "Premium Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Premium Gig",
                image: "",
            }, {
                price: 119.99,
                type: "INDIVIDUAL",
                description: "Premium Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Premium Gig",
                image: "",
            }, {
                price: 119.99,
                type: "INDIVIDUAL",
                description: "Premium Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Premium Gig",
                image: "",
            }, {
                price: 119.99,
                type: "INDIVIDUAL",
                description: "Premium Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Premium Gig",
                image: "",
            }, {
                price: 119.99,
                type: "INDIVIDUAL",
                description: "Premium Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Premium Gig",
                image: "",
            }, {
                price: 119.99,
                type: "INDIVIDUAL",
                description: "Premium Gig Description",
                freelancerProfileId: freelancerProfile.id,
                title: "Premium Gig",
                image: "",
            }]
        })
        const successResponse = responses(gigs).success
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