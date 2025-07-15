import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBService } from '../common/aws-sdks/dynamoDB'
import { handleNotFoundError, handleBadRequestError, handleInternalError, handleSuccessResponse } from '../common/errors'

const deleteUserHandler: APIGatewayProxyHandler = async (event) => {
    try {
        const userId = event.pathParameters?.id

        if (!userId) {
            return handleBadRequestError('User ID is required')
        }

        const deleted = await DynamoDBService.deleteUser(userId)

        if (!deleted) {
            return handleNotFoundError('User not found')
        }

        return handleSuccessResponse({ message: 'User deleted successfully' })
    } catch (error: any) {
        return handleInternalError(error)
    }
}

export default deleteUserHandler
