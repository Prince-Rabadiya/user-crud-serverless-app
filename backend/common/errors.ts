import { z } from 'zod'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

export const createResponse = (statusCode: number, body: any) => ({
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
})

export const handleValidationError = (error: z.ZodError) => {
    return createResponse(400, {
        message: 'Validation failed',
        errors: error.issues
    })
}

export const handleNotFoundError = (message: string = 'Resource not found') => {
    return createResponse(404, { message })
}

export const handleBadRequestError = (message: string) => {
    return createResponse(400, { message })
}

export const handleInternalError = (error: any) => {
    return createResponse(500, {
        message: 'Internal server error',
        error: error.message
    })
}

export const handleSuccessResponse = (data: any, statusCode: number = 200) => {
    return createResponse(statusCode, data)
}
