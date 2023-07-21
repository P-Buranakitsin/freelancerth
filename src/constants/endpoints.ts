export interface GigsParams {
    page?: number;
    limit?: number;
    title?: string;
    freelancerType?: FreelancerType;
    skills?: SkillName[];
    gigType?: GigType;
    price?: string;
}

function createGigsEndpoint(basePath: string, params: GigsParams) {
    // Empty object
    if (Object.keys(params).length === 0) {
        return basePath
    }

    const { page = 0, title, freelancerType, skills, gigType, price, limit = 6 } = params
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
        checkoutSessions: () => `/api/checkout_sessions`,
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
        gigDetails: (freelancerProfileId: string, gigId: string) => `/gig/${freelancerProfileId}/${gigId}`,
        publicUserProfile: (userId: string) => `/user/public/${userId}`,
        gigCart: (userId: string) => `/cart/gigs/${userId}`
    }

}