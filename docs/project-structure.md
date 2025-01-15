# Project Structure Documentation

## Overview
This document outlines the structure and organization of the project, explaining the purpose of each directory and key files.

## Root Directory Structure
```
├── docs/                  # Project documentation
├── public/               # Static assets
├── src/                  # Source code
├── __tests__/           # Test files
├── .env                 # Environment variables
└── package.json         # Project dependencies and scripts
```

## Source Code (`src/`)

### Components (`src/components/`)
```
components/
├── ui/                  # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── layout/             # Layout components
└── email-template.tsx  # Email notification templates
```

### Pages (`src/pages/`)
```
pages/
├── api/                # API routes
│   ├── auth/          # Authentication endpoints
│   ├── projects/      # Project management endpoints
│   ├── invites/       # Invitation handling endpoints
│   └── send/          # Email sending endpoint
├── auth/              # Authentication pages
├── projects/          # Project-related pages
└── _app.tsx           # Next.js app configuration
```

### Library (`src/lib/`)
```
lib/
├── hooks/             # Custom React hooks
├── schemas/           # Validation schemas
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   ├── api/          # API-related utilities
│   │   ├── hooks/    # API hooks
│   │   └── axios.ts  # Axios configuration
│   └── supabase/     # Supabase client utilities
└── views/            # View components
    ├── Auth/         # Authentication views
    ├── tasks/        # Task management views
    └── settings/     # Settings views
```

## Key Directories and Files

### Authentication (`src/lib/views/Auth/`)
- `AuthView.tsx`: Main authentication component
- `components/`: Authentication form components
  - `SignInForm.tsx`: Sign-in form
  - `SignUpForm.tsx`: Registration form
  - `EnterEmailForm.tsx`: Email entry form

### API Routes (`src/pages/api/`)
- `auth/`: Authentication endpoints
  - `signIn.ts`: Sign-in handler
  - `signUp.ts`: Registration handler
  - `check.ts`: Email verification
- `invites/`: Invitation management
  - `[inviteId]/accept.ts`: Invite acceptance handler
- `projects/`: Project management endpoints
  - `[projectId]/`: Project-specific operations
    - `team/`: Team management
    - `tasks/`: Task management

### Types (`src/lib/types/`)
- `auth.ts`: Authentication types
- `tasks.ts`: Task-related types
- `supabase-types.ts`: Database types
- `org.ts`: Organization/team types

### API Hooks (`src/lib/utils/api/hooks/`)
- `Auth/`: Authentication hooks
  - `useSignIn.ts`: Sign-in hook
  - `useSignUp.ts`: Registration hook
- `Team/`: Team management hooks
  - `useCreateInvite.ts`: Team invitation hook
  - `useProjectTeam.ts`: Team data hook
- `Tasks/`: Task management hooks

## Testing (`__tests__/`)
```
__tests__/
├── e2e-tests/        # End-to-end tests
└── unit/            # Unit tests
```

## Documentation (`docs/`)
```
docs/
├── project-structure.md  # This file
└── api/                 # API documentation
```

## Key Features

### Authentication Flow
- Email-based authentication
- User registration and sign-in
- Invitation handling and acceptance

### Project Management
- Project creation and settings
- Team member management
- Task management and organization

### Email Notifications
- Invitation emails
- Custom email templates
- Email sending service integration

## Development Guidelines

### Component Organization
- UI components should be placed in `components/ui/`
- Page-specific components go in their respective view directories
- Reusable hooks should be in `lib/hooks/`

### API Structure
- API routes follow Next.js API conventions
- Each endpoint has its corresponding hook in `lib/utils/api/hooks/`
- Type definitions are centralized in `lib/types/`

### Testing
- Unit tests for utilities and hooks
- E2E tests for critical user flows
- Test files mirror the source structure

### Type Safety
- All components and functions should be properly typed
- Database types are generated from Supabase schema
- API responses and requests have defined types
