import { APIGatewayProxyHandler } from 'aws-lambda'
import { z } from 'zod'
import { DynamoDBService } from '../common/aws-sdks/dynamoDB'
import { handleValidationError, handleNotFoundError, handleBadRequestError, handleInternalError, handleSuccessResponse, handleConflictError } from '../common/errors'

// Zod schema for user update validation
const updateUserSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Valid email is required').optional(),
    age: z.number().min(1, 'Age must be a positive number').optional(),
})

const updateUserHandler: APIGatewayProxyHandler = async (event) => {
    try {
        const userId = event.pathParameters?.id
        const body = JSON.parse(event.body || '{}')

        if (!userId) {
            return handleBadRequestError('User ID is required')
        }

        // Validate input using Zod
        const updateData = updateUserSchema.parse(body)

        const updatedUser = await DynamoDBService.updateUser(userId, updateData)

        if (!updatedUser) {
            return handleNotFoundError('User not found')
        }

        return handleSuccessResponse({ message: 'User updated successfully', user: updatedUser })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return handleValidationError(error)
        }
        if (error.message === 'No fields to update') {
            return handleBadRequestError('No fields to update')
        }
        if (error.message === 'Email already exists') {
            return handleConflictError('Email already exists')
        }
        return handleInternalError(error)
    }
}

export default updateUserHandler
