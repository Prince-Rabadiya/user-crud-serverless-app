import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

interface User {
    id: string
    name: string
    email: string
    age?: number
    createdAt: string
    updatedAt: string
}

interface CreateUserRequest {
    name: string
    email: string
    age?: number
}

interface UpdateUserRequest {
    name?: string
    email?: string
    age?: number
}

const client = new DynamoDBClient({})
const dynamoDb = DynamoDBDocumentClient.from(client)
const TABLE_NAME = process.env.USERS_TABLE || 'Users'

export class DynamoDBService {
    static async getUserByEmail(email: string): Promise<User | null> {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: 'EmailIndex',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        })

        const result = await dynamoDb.send(command)
        return result.Items && result.Items.length > 0 ? result.Items[0] as User : null
    }

    static async createUser(userData: CreateUserRequest & { id: string; createdAt: string; updatedAt: string }): Promise<User> {
        // Check if email already exists
        const existingUser = await this.getUserByEmail(userData.email)
        if (existingUser) {
            throw new Error('Email already exists')
        }

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: userData,
        })

        await dynamoDb.send(command)
        return userData as User
    }

    static async getUserById(userId: string): Promise<User | null> {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { id: userId },
        })

        const result = await dynamoDb.send(command)
        return result.Item as User || null
    }

    static async listUsers(limit: number = 10, lastEvaluatedKey?: string): Promise<{
        users: User[]
        lastEvaluatedKey?: string
        count: number
    }> {
        const params: any = {
            TableName: TABLE_NAME,
            Limit: limit,
        }

        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = { id: lastEvaluatedKey }
        }

        const command = new ScanCommand(params)
        const result = await dynamoDb.send(command)

        return {
            users: result.Items as User[] || [],
            lastEvaluatedKey: result.LastEvaluatedKey?.id,
            count: result.Count || 0,
        }
    }

    /**
     * Update user
     */
    static async updateUser(userId: string, updateData: UpdateUserRequest): Promise<User | null> {
        // First check if user exists
        const existingUser = await this.getUserById(userId)
        if (!existingUser) {
            return null
        }

        // If updating email, check if new email already exists
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await this.getUserByEmail(updateData.email)
            if (emailExists) {
                throw new Error('Email already exists')
            }
        }

        // Build update expression
        const updateExpressions: string[] = []
        const expressionAttributeNames: any = {}
        const expressionAttributeValues: any = {}

        if (updateData.name) {
            updateExpressions.push('#name = :name')
            expressionAttributeNames['#name'] = 'name'
            expressionAttributeValues[':name'] = updateData.name
        }

        if (updateData.email) {
            updateExpressions.push('#email = :email')
            expressionAttributeNames['#email'] = 'email'
            expressionAttributeValues[':email'] = updateData.email
        }

        if (updateData.age !== undefined) {
            updateExpressions.push('#age = :age')
            expressionAttributeNames['#age'] = 'age'
            expressionAttributeValues[':age'] = updateData.age
        }

        // updatedAt timestamp
        updateExpressions.push('#updatedAt = :updatedAt')
        expressionAttributeNames['#updatedAt'] = 'updatedAt'
        expressionAttributeValues[':updatedAt'] = new Date().toISOString()

        if (updateExpressions.length === 1) { // Only updatedAt
            throw new Error('No fields to update')
        }

        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: userId },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        })

        const result = await dynamoDb.send(command)
        return result.Attributes as User
    }

    static async deleteUser(userId: string): Promise<boolean> {
        const existingUser = await this.getUserById(userId)
        if (!existingUser) {
            return false
        }

        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id: userId },
        })

        await dynamoDb.send(command)
        return true
    }
}
