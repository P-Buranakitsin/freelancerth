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
        enabled: !!session,
    });
};

export const useFreelancerProfile = (session: Session | null) => {
    return useQuery({
        queryKey: ["freelancerProfileByUserId"],
        queryFn: async () => {
            const res = await fetch(
                endpoints.API.freelancerProfileByUserId(session?.user.sub || ""),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const skills =
                (await res.json()) as IResponseDataGETFreelancerProfileSkillsByUserId;
            return skills;
        },
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