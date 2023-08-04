import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { responses } from "@/constants/responses";
import { RegisterFreelancer, RegisterFreelancerAPI, RegisterFreelancerSchemaAPI } from "@/models/RegisterFreelancer";
import { PutFreelancerProfileSchema } from "@/models/FreelancerProfile/PutFreelancerProfileAPI";

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
        const freelancerProfile = await prisma.freelancerProfile.findUnique({
            where: {
                userId: params.userId,
            },
            include: {
                skills: true,
            },
        });
        if (!freelancerProfile) {
            const notfoundResponse = responses('profile').notFoundError
            return NextResponse.json(notfoundResponse.body, notfoundResponse.status)
        }
        const skillNames = freelancerProfile.skills.map((skill) => skill.skillName);
        const responseData = {
            ...freelancerProfile,
            skills: skillNames,
        };
        const successResponse = responses(responseData).success
        return NextResponse.json(successResponse.body, successResponse.status)
    } catch (error) {
        console.log(error)
        const errorResponse = responses(error).internalError
        return NextResponse.json(errorResponse.body, errorResponse.status)
    }
}

export const PUT = async (req: NextRequest, { params }: { params: { userId: string } }) => {
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

        const json = await req.json() as RegisterFreelancer | RegisterFreelancerAPI

        const response = RegisterFreelancerSchemaAPI.safeParse(json);
        if (!response.success) {
            const { errors } = response.error;

            const errorResponse = responses(errors).badRequest
            return NextResponse.json(errorResponse.body, errorResponse.status)
        }
        const freelancerProfile = await prisma.freelancerProfile.upsert({
            where: {
                userId: params.userId
            },
            update: {
                type: json.freelancerType,
                verified: false,
                bio: json.bio,
                githubURL: json.githubURL,
                linkedInURL: json.linkedInURL,
                passportOrId: json.passportOrIdImage[0].fileUrl,
                portfolioURL: json.portfolioURL,
                resumeOrCV: json.resumeOrCV[0].fileUrl,
                userId: params.userId,
                skills: {
                    deleteMany: {},
                    create: json.skills.map(skillName => ({
                        skill: {
                            connectOrCreate: {
                                where: { name: skillName },
                                create: { name: skillName }
                            }
                        }
                    }))
                }
            },
            create: {
                type: json.freelancerType,
                verified: false,
                bio: json.bio,
                githubURL: json.githubURL,
                linkedInURL: json.linkedInURL,
                passportOrId: json.passportOrIdImage[0].fileUrl,
                portfolioURL: json.portfolioURL,
                resumeOrCV: json.resumeOrCV[0].fileUrl,
                userId: params.userId,
                skills: {
                    create: json.skills.map(skillName => ({
                        skill: {
                            connectOrCreate: {
                                where: { name: skillName },
                                create: { name: skillName }
                            }
                        }
                    }))
                }
            }
        })
        const successResponse = responses(freelancerProfile).success
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

export const PATCH = async (req: NextRequest, { params }: { params: { userId: string } }) => {
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
        const resObj = await req.json() as IRequestPatchFreelancerByUserId

        const parsedResObj = PutFreelancerProfileSchema.safeParse(resObj);
        if (!parsedResObj.success) {
            const { errors } = parsedResObj.error;

            const errorResponse = responses(errors).badRequest
            return NextResponse.json(errorResponse.body, errorResponse.status)
        }

        const freelancerProfile = await prisma.freelancerProfile.update({
            where: {
                userId: params.userId
            },
            data: {
                bio: resObj.bio,
                skills: resObj.skills ? {
                    deleteMany: {},
                    create: resObj.skills.map(skillName => ({
                        skill: {
                            connectOrCreate: {
                                where: { name: skillName },
                                create: { name: skillName }
                            }
                        }
                    }))
                } : undefined,
                passportOrId: resObj.passportOrId,
                resumeOrCV: resObj.resumeOrCV,
                linkedInURL: resObj.linkedInURL,
                githubURL: resObj.githubURL,
                portfolioURL: resObj.portfolioURL,
                verified: resObj.verified,
            },
            include: {
                skills: true
            }
        })

        const formattedSkills = freelancerProfile.skills.map((skill) => skill.skillName)

        const successResponse = responses({...freelancerProfile, skills: formattedSkills }).success
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