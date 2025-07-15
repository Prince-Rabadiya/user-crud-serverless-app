import { APIGatewayProxyHandler } from 'aws-lambda'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBService } from '../common/aws-sdks/dynamoDB'
import { handleValidationError, handleInternalError, handleSuccessResponse, handleConflictError } from '../common/errors'

// Zod schema for user validation
const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    age: z.number().min(1, 'Age must be a positive number').optional(),
})

const createUserHandler: APIGatewayProxyHandler = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}')

        // Validation
        const userData = userSchema.parse(body)

        const user = await DynamoDBService.createUser({
            id: uuidv4(),
            name: userData.name,
            email: userData.email,
            age: userData.age,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })

        return handleSuccessResponse({ message: 'User created successfully', user }, 201)
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return handleValidationError(error)
        }
        if (error.message === 'Email already exists') {
            return handleConflictError(error.message)
        }
        return handleInternalError(error)
    }
}

export default createUserHandler
