# User CRUD API

Serverless REST API for managing users with DynamoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure AWS credentials:
```bash
aws configure
```

3. Deploy to AWS:
```bash
npm run deploy
```

4. Run locally (optional):
```bash
npm run dev
```

## API Endpoints

- `GET /users` - List all users
- `POST /users` - Create user
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

## Environment

- Node.js 22.x
- AWS Lambda + DynamoDB

## Scripts

- `npm run dev` - Local development
- `npm run deploy` - Deploy to AWS
- `npm run remove` - Remove from AWS
