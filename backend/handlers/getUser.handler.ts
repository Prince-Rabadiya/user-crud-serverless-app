import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBService } from '../common/aws-sdks/dynamoDB'
import { handleNotFoundError, handleBadRequestError, handleInternalError, handleSuccessResponse } from '../common/errors'

const getUserHandler: APIGatewayProxyHandler = async (event) => {
    try {
        const userId = event.pathParameters?.id

        if (!userId) {
            return handleBadRequestError('User ID is required')
        }

        const user = await DynamoDBService.getUserById(userId)

        if (!user) {
            return handleNotFoundError('User not found')
        }

        return handleSuccessResponse({ user })
    } catch (error: any) {
        return handleInternalError(error)
    }
}

export default getUserHandler
