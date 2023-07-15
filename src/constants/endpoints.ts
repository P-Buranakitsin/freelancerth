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

    const { page = 0, title, freelancerType, skills, gigType, price } = params
    let url = `${basePath}?page=${page}`;
    if (title) {
        url += `&title=${encodeURIComponent(title)}`;
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
    },
    PAGE: {
        gigs: (params: GigsParams) => createGigsEndpoint('gigs', params)
    }

}