import { IPagination, responses } from "@/constants/responses";

describe('responses', () => {
    it('should return the appropriate unauthorised response', () => {
        const expected = {
            body: {
                message: 'unauthorized access',
                data: null,
            },
            status: {
                status: 403
            }
        };
        expect(responses().unauthorized).toEqual(expected);
    });

    it('should return the appropriate success response', () => {
        const responseData = 'any';
        const expected = {
            body: {
                message: 'success',
                data: responseData,
            },
            status: {
                status: 200
            }
        };
        expect(responses(responseData).success).toEqual(expected);
    });

    it('should return the appropriate internal server error response', () => {
        const responseData = 'any';
        const expected = {
            body: {
                message: responseData,
                error: 'internal server error',
            },
            status: {
                status: 500
            }
        };
        expect(responses(responseData).internalError).toEqual(expected);
    });

    it('should return the appropriate not found error response', () => {
        const responseData = 'any';
        const expected = {
            body: {
                message: `${responseData} not found`,
                data: null,
            },
            status: {
                status: 404
            }
        };
        expect(responses(responseData).notFoundError).toEqual(expected);
    });

    it('should return the appropriate missing request body error response', () => {
        const responseData = 'any';
        const expected = {
            body: { error: responseData, message: "The request body is missing or invalid" },
            status: {
                status: 400
            }
        };
        expect(responses(responseData).badRequest).toEqual(expected);
    });

    it('should return the appropriate pagination success response', () => {
        const responseData = 'any';
        const paginationData = { totalItems: 11, limit: 10, page: 0, totalPages: 2 } as IPagination;
        const totalAmountReceived = '4.95';
        const expected = {
            body: {
                message: 'success',
                data: responseData,
                totalAmountReceived,
                pagination: paginationData,
            },
            status: {
                status: 200
            }
        };
        expect(responses(responseData, paginationData, totalAmountReceived).pagination).toEqual(expected);
    });

    it('should return the appropriate conflict error response', () => {
        const expected = {
            body: {
                message: "freelancer profile already exists",
                data: null,
            },
            status: {
                status: 409,
            }
        };
        expect(responses().conflict).toEqual(expected);
    });
});
