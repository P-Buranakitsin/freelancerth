import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";
import {
    SkillName
} from "@prisma/client";

export const POST = async (req: NextRequest) => {
    const token = await getToken({ req })
    // Not Signed in or not an admin
    if (!token?.sub) {
        const unauthorizedResponse = responses().unauthorized
        return NextResponse.json(unauthorizedResponse.body, unauthorizedResponse.status)
    }
    try {
        const skills = await prisma.skill.createMany({
            data: [{
                name: "AGILE_METHODOLOGY"
            }, {
                name: "CYPRESS"
            }, {
                name: "DATA_ANALYSIS"
            }, {
                name: "DOCKER"
            }, {
                name: "FIGMA"
            }, {
                name: "GOLANG"
            }, {
                name: "ILLUSTRATOR"
            }, {
                name: "JAVA"
            }, {
                name: "JAVASCRIPT"
            }, {
                name: "JEST"
            }, {
                name: "KUBERNETES"
            }, {
                name: "PHOTOSHOP"
            }, {
                name: "POSTMAN"
            }, {
                name: "PROJECT_PLANNING"
            }, {
                name: "PYTHON"
            }, {
                name: "REQUIREMENTS_ANALYSIS"
            }],
        });
        const successResponse = responses(skills).success
        return NextResponse.json(successResponse.body, successResponse.status)

    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }


}