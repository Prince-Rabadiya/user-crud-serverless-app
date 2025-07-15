import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBService } from '../common/aws-sdks/dynamoDB'
import { handleInternalError, handleSuccessResponse } from '../common/errors'

const listUserHandler: APIGatewayProxyHandler = async (event) => {
    try {
        const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit) : 10
        const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey

        const result = await DynamoDBService.listUsers(limit, lastEvaluatedKey)

        return handleSuccessResponse(result)
    } catch (error: any) {
        return handleInternalError(error)
    }
}

export default listUserHandler
