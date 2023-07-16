import { endpoints } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";

interface GigsHookParams {
    session: Session | null,
    page: number,
    limit: number,
    title: string,
    freelancerType: FreelancerType | undefined
    skills?: SkillName[] | undefined;
    type?: GigType | undefined
    price?: string | undefined
}

export const useGigs = (
    params: GigsHookParams

) => {
    const { session, ...rest } = params
    return useQuery({
        queryKey: ["gigs", rest],
        queryFn: async () => {
            const res = await fetch(endpoints.API.gigs(rest), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const gigs = (await res.json()) as IResponseGETGigs;
            return gigs;
        },
        keepPreviousData: true,
    });
};

export async function getFreelancerProfileByUserId(userId: string) {
    const res = await fetch(
        endpoints.API.freelancerProfileByUserId(userId),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const skills =
        (await res.json()) as IResponseDataGETFreelancerProfileByUserId;
    return skills;
}

export const useFreelancerProfile = (session: Session | null) => {
    return useQuery({
        queryKey: ["freelancerProfileByUserId", session?.user.sub || ""],
        queryFn: () => getFreelancerProfileByUserId(session?.user.sub || ""),
        enabled: !!session,
    });
}

async function getProfileByUserId(userId: string) {
    const res = await fetch(endpoints.API.profileByUserId(userId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const profiles = (await res.json()) as IResponseDataGETProfileByUserId;
    return profiles;
}

export const useProfiles = (session: Session | null) => {
    const userId = session?.user.sub || ''
    return useQuery({
        queryKey: ["profiles", userId],
        queryFn: () => getProfileByUserId(userId),
        enabled: !!session,
    });
}

async function getGigByGigId(gigId: string) {
    const res = await fetch(endpoints.API.gigByGigId(gigId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const gig = (await res.json()) as IResponseGETGig
    return gig
}

export const useGig = (gigId: string) => {
    return useQuery({
        queryKey: ["gig", gigId],
        queryFn: () => getGigByGigId(gigId),
    })
}