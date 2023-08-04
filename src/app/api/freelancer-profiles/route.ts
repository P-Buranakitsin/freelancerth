import { responses } from "@/constants/responses";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin trying to get all freelancers
    if (!token || (token.role !== "ADMIN")) {
        const unauthorizedResponse = responses().unauthorized;
        return NextResponse.json(
            unauthorizedResponse.body,
            unauthorizedResponse.status
        );
    }

    try {
        const url = new URL(req.url)
        const params = new URLSearchParams(url.search)
        // Query params
        const page = Number(params.get("page")) || 0
        const limit = Number(params.get("limit")) || 10
        const verified = params.getAll("verified") || undefined

        const whereCondition: Prisma.FreelancerProfileWhereInput = {

        };

        if (verified.includes('true') && verified.includes('false')) {
        } else if (verified.includes('true')) {
            whereCondition.verified = JSON.parse(verified[0])
        } else if (verified.includes('false')) {
            whereCondition.verified = JSON.parse(verified[0])
        }

        const [totalItems, data] = await prisma.$transaction([
            prisma.freelancerProfile.count({ where: whereCondition }),
            prisma.freelancerProfile.findMany({
                where: whereCondition,
                include: {
                    skills: true,
                    user: true,
                },
                skip: page * limit,
                take: limit,
            })
        ])

        const formattedData = data.map(el => ({
            ...el,
            skills: el.skills.map(skill => skill.skillName)
        }))

        const pageCount = Math.ceil(totalItems / limit)

        const paginationResponse = responses(formattedData, {
            limit,
            totalItems,
            totalPages: pageCount,
            page,
        }).pagination

        return NextResponse.json(paginationResponse.body, paginationResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}