
export const responses = (responseData?: any) => ({
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
    }

})
