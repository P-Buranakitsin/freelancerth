import { endpoints } from "@/constants/endpoints";
import { PaymentStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { Session } from "next-auth";

interface GigsHookParams {
    session: Session | null,
    page: number,
    limit: number,
    title: string,
    freelancerType: FreelancerType | undefined
    freelancerProfileId: string | undefined
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
        (await res.json()) as IResponsGETFreelancerProfileByUserId;
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

async function getUserByUserId(userId: string) {
    const res = await fetch(endpoints.API.userById(userId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const user = (await res.json()) as IResponseGETUserById
    return user
}

export const useUser = (userId: string) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUserByUserId(userId),

    })
}

async function getCartByUserId(userId: string) {
    const res = await fetch(endpoints.API.cartByUserId(userId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const cart = (await res.json()) as IResponseGETCartByUserId
    return cart
}

export const useCart = (session: Session | null) => {
    const userId = session?.user.sub || ''
    return useQuery({
        queryKey: ["cart", userId],
        queryFn: () => getCartByUserId(userId),
        staleTime: Infinity,
        enabled: !!session
    })
}

async function getOrderHistoryByUserId(userId: string, fetchDataOptions: PaginationState & { paymentStatus: PaymentStatus[] }) {
    const res = await fetch(endpoints.API.orderHistory(userId, fetchDataOptions), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const orderHistory = (await res.json()) as IResponseGETOrderHistoryByUserId
    return orderHistory
}

export const useOrderHistory = (session: Session | null, fetchDataOptions: PaginationState & { paymentStatus: PaymentStatus[] }) => {
    const userId = session?.user.sub || ''
    return useQuery({
        queryKey: ["orderHistory", userId, fetchDataOptions],
        queryFn: () => getOrderHistoryByUserId(userId, fetchDataOptions),
        enabled: !!session,
        keepPreviousData: true,
    })
}

async function getCustomerOrderByFreelancerId(freelancerId: string, fetchDataOptions: PaginationState & { paymentStatus: PaymentStatus[] }) {
    const res = await fetch(endpoints.API.customerOrder(freelancerId, fetchDataOptions), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const customerOrder = (await res.json()) as IResponseGETCustomerOrderByFreelancerId
    return customerOrder
}

export const useCustomerOrder = (session: Session | null, freelancerId: string, fetchDataOptions: PaginationState & { paymentStatus: PaymentStatus[] }) => {
    return useQuery({
        queryKey: ["customerOrder", freelancerId, fetchDataOptions],
        queryFn: () => getCustomerOrderByFreelancerId(freelancerId, fetchDataOptions),
        enabled: !!session,
        keepPreviousData: true,
    })
}