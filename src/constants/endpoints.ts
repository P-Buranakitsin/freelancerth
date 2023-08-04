import { PaymentStatus } from "@prisma/client";
import { PaginationState } from "@tanstack/react-table";

export interface GigsParams {
    page?: number;
    limit?: number;
    title?: string;
    freelancerType?: FreelancerType;
    skills?: SkillName[];
    gigType?: GigType;
    price?: string;
    freelancerProfileId?: string;
}

function createGigsEndpoint(basePath: string, params: GigsParams) {
    // Empty object
    if (Object.keys(params).length === 0) {
        return basePath
    }

    const { page = 0, title, freelancerType, skills, gigType, price, limit = 6, freelancerProfileId } = params
    let url = `${basePath}?page=${page}`;
    if (title) {
        url += `&title=${encodeURIComponent(title)}`;
    }
    if (limit) {
        url += `&limit=${encodeURIComponent(limit)}`;
    }
    if (freelancerType) {
        url += `&freelancerType=${encodeURIComponent(freelancerType)}`;
    }
    if (skills && skills.length > 0) {
        url += '&'
        url += skills.map(skill => `skills=${encodeURIComponent(skill)}`).join('&');
    }
    if (gigType) {
        url += `&gigType=${encodeURIComponent(gigType)}`;
    }
    if (price) {
        url += `&price=${encodeURIComponent(price)}`;
    }
    if (freelancerProfileId) {
        url += `&freelancerProfileId=${encodeURIComponent(freelancerProfileId)}`
    }
    return url;
};

export const endpoints = {
    API: {
        userById: (id: string) => `/api/users/${id}`,
        profileByUserId: (userId: string) => `/api/profiles/${userId}`,
        freelancerProfileByUserId: (userId: string) => `/api/freelancer-profiles/${userId}`,
        gigs: (params: GigsParams) => createGigsEndpoint('/api/gigs', params),
        gigByGigId: (gigId: string) => `/api/gigs/${gigId}`,
        cartByUserId: (userId: string) => `/api/carts/${userId}`,
        gigsOnCartByGigIdAndUserId: (gigId: string, userId: string) => `/api/gigs-on-cart/${gigId}/${userId}`,
        checkoutSessions: () => `/api/stripe/checkout_sessions`,
        orderHistory: (userId: string, fetchDataOptions: PaginationState & { paymentStatus: PaymentStatus[] }) => {
            const { paymentStatus } = fetchDataOptions
            let url = `/api/order/history/${userId}?page=${fetchDataOptions.pageIndex}&limit=${fetchDataOptions.pageSize}`
            if (paymentStatus.length > 0) {
                url += `&`
                url += paymentStatus.map(paymentStatus => `paymentStatus=${encodeURIComponent(paymentStatus)}`).join('&');
            }
            return url
        },
        customerOrder: (freelancerId: string, fetchDataOptions: PaginationState & { paymentStatus: PaymentStatus[] }) => {
            const { paymentStatus } = fetchDataOptions
            let url = `/api/customer-order/${freelancerId}?page=${fetchDataOptions.pageIndex}&limit=${fetchDataOptions.pageSize}`
            if (paymentStatus.length > 0) {
                url += `&`
                url += paymentStatus.map(paymentStatus => `paymentStatus=${encodeURIComponent(paymentStatus)}`).join('&');
            }
            return url
        },
        createConnectedAccount: () => `/api/stripe/create_connected_account`,
        createLoginLink: () => `/api/stripe/create_login_link`,
        withdraw: () => `/api/stripe/withdraw`,
        users: () => `/api/users`,
        freelancerProfiles: (fetchDataOptions: PaginationState & { verifiedArray?: boolean[] }) => {
            const { verifiedArray } = fetchDataOptions
            let url = `/api/freelancer-profiles?page=${fetchDataOptions.pageIndex}&limit=${fetchDataOptions.pageSize}`
            if (verifiedArray?.includes(true)) {
                url += `&verified=true`
            }
            if (verifiedArray?.includes(false)) {
                url += `&verified=false`
            }
            return url
        }
    },
    PAGE: {
        gigs: (params: GigsParams) => createGigsEndpoint('gigs', params),
        home: () => '/',
        browseGigs: (page: number, freelancerType?: FreelancerType) => {
            const basePath = `/browse/gigs?page=${page}`
            if (freelancerType) {
                return `${basePath}&freelancerType=${freelancerType}`
            }
            return basePath
        },
        registerFreelancer: () => `register/freelancer`,
        gigDetails: (freelancerId: string, gigId: string) => `/gig/${freelancerId}/${gigId}`,
        publicUserProfile: (userId: string) => `/user/public/${userId}`,
        gigCart: (userId: string) => `/cart/gigs/${userId}`,
        orderHistory: (userId: string) => `/order/history/${userId}`,
        customerOrder: (freelancerId: string) => `/customer-order/${freelancerId}`,
        mangeGigs: (freelancerId: string) => `/manage-gigs/${freelancerId}`,
        freelancerProfilePage: (freelancerId: string) => `/freelancer-profile/${freelancerId}`,
        adminDashboard: () => `/admin/dashboard`,
        adminFreelancers: () => `/admin/freelancers`,
    }

}