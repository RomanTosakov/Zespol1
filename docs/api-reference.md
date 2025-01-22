# TaskFlow API Reference

## Authentication

### Sign Up
```typescript
POST /api/auth/signUp

Request:
{
  "email": string,
  "password": string,
  "name": string
}

Response:
200 OK
{
  "user": {
    "id": string,
    "email": string,
    "name": string
  }
}

Errors:
400 - Invalid request data
409 - Email already exists
500 - Server error
```

### Sign In
```typescript
POST /api/auth/signIn

Request:
{
  "email": string,
  "password": string
}

Response:
200 OK
{
  "user": {
    "id": string,
    "email": string,
    "name": string
  },
  "session": {
    "access_token": string
  }
}

Errors:
400 - Invalid credentials
401 - Unauthorized
500 - Server error
```

## Projects

### List Projects
```typescript
GET /api/projects

Response:
200 OK
{
  "projects": [
    {
      "id": string,
      "name": string,
      "slug": string,
      "created_at": string,
      "primary_owner": string
    }
  ]
}

Errors:
401 - Unauthorized
500 - Server error
```

### Create Project
```typescript
POST /api/projects

Request:
{
  "name": string,
  "description"?: string
}

Response:
201 Created
{
  "project": {
    "id": string,
    "name": string,
    "slug": string
  }
}

Errors:
400 - Invalid request data
401 - Unauthorized
500 - Server error
```

### Get Project Details
```typescript
GET /api/projects/[projectId]

Response:
200 OK
{
  "project": {
    "id": string,
    "name": string,
    "slug": string,
    "description": string,
    "created_at": string,
    "primary_owner": string
  }
}

Errors:
401 - Unauthorized
404 - Project not found
500 - Server error
```

## Tasks

### List Tasks
```typescript
GET /api/projects/[projectId]/tasks

Query Parameters:
- sprint_id?: string
- status?: string
- assignee?: string

Response:
200 OK
{
  "tasks": [
    {
      "id": string,
      "title": string,
      "description": string,
      "status": string,
      "member_id": string,
      "sprint_id": string,
      "sort_id": number
    }
  ]
}

Errors:
401 - Unauthorized
404 - Project not found
500 - Server error
```

### Create Task
```typescript
POST /api/projects/[projectId]/tasks

Request:
{
  "title": string,
  "description"?: string,
  "member_id"?: string,
  "sprint_id"?: string
}

Response:
201 Created
{
  "task": {
    "id": string,
    "title": string,
    "description": string,
    "status": string,
    "member_id": string,
    "sprint_id": string,
    "sort_id": number
  }
}

Errors:
400 - Invalid request data
401 - Unauthorized
404 - Project not found
500 - Server error
```

## Sprints

### List Sprints
```typescript
GET /api/projects/[projectId]/sprints

Response:
200 OK
{
  "sprints": [
    {
      "id": string,
      "name": string,
      "description": string,
      "start_date": string,
      "end_date": string,
      "is_completed": boolean
    }
  ]
}

Errors:
401 - Unauthorized
404 - Project not found
500 - Server error
```

### Create Sprint
```typescript
POST /api/projects/[projectId]/sprints

Request:
{
  "name": string,
  "description"?: string,
  "start_date": string,
  "end_date": string
}

Response:
201 Created
{
  "sprint": {
    "id": string,
    "name": string,
    "description": string,
    "start_date": string,
    "end_date": string,
    "is_completed": false
  }
}

Errors:
400 - Invalid request data
401 - Unauthorized
404 - Project not found
500 - Server error
```

## Team Members

### List Project Members
```typescript
GET /api/projects/[projectId]/members

Response:
200 OK
{
  "members": [
    {
      "id": string,
      "email": string,
      "name": string,
      "role": string
    }
  ]
}

Errors:
401 - Unauthorized
404 - Project not found
500 - Server error
```

### Invite Member
```typescript
POST /api/projects/[projectId]/members

Request:
{
  "email": string,
  "role": "member" | "manager" | "administrator"
}

Response:
201 Created
{
  "invitation": {
    "id": string,
    "email": string,
    "role": string
  }
}

Errors:
400 - Invalid request data
401 - Unauthorized
403 - Insufficient permissions
404 - Project not found
500 - Server error
```

## Comments

### List Task Comments
```typescript
GET /api/projects/[projectId]/tasks/[taskId]/comments

Response:
200 OK
{
  "comments": [
    {
      "id": string,
      "content": string,
      "created_at": string,
      "author": {
        "id": string,
        "name": string
      }
    }
  ]
}

Errors:
401 - Unauthorized
404 - Task not found
500 - Server error
```

### Create Comment
```typescript
POST /api/projects/[projectId]/tasks/[taskId]/comments

Request:
{
  "content": string
}

Response:
201 Created
{
  "comment": {
    "id": string,
    "content": string,
    "created_at": string,
    "author": {
      "id": string,
      "name": string
    }
  }
}

Errors:
400 - Invalid request data
401 - Unauthorized
404 - Task not found
500 - Server error
``` 