
export interface IPagination {
    totalItems: number
    limit: number
    page: number
    totalPages: number
}

export const responses = (responseData?: any, pagination?: IPagination) => ({
    unauthorized: {
        body: {
            message: 'unauthorized access',
            data: null,
        },
        status: {
            status: 403
        }
    },
    success: {
        body: {
            message: 'success',
            data: responseData
        },
        status: {
            status: 200
        }
    },
    internalError: {
        body: {
            message: 'internal server error',
            error: responseData
        },
        status: {
            status: 500
        }
    },
    notFoundError: {
        body: {
            message: `${responseData} not found`,
            data: null
        },
        status: {
            status: 404
        }
    },
    badRequest: {
        body: { error: responseData || "Bad Request", message: "The request body is missing or invalid" },
        status: {
            status: 400
        }
    },
    pagination: {
        body: {
            message: 'success',
            data: responseData,
            pagination
        },
        status: {
            status: 200
        }
    }
})
