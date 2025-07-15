export interface User {
    id: string
    name: string
    email: string
    age?: number
    createdAt: string
    updatedAt: string
}

export interface CreateUserRequest {
    name: string
    email: string
    age?: number
}

export interface UpdateUserRequest {
    name?: string
    email?: string
    age?: number
}

export interface UserResponse {
    user: User
}

export interface UsersListResponse {
    users: User[]
    lastEvaluatedKey?: string
    count: number
} 