# TaskFlow Technical Documentation

## System Architecture

### Frontend Architecture

#### Core Technologies
- **Next.js**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **TanStack Query**: Data synchronization
- **Tailwind CSS**: Utility-first CSS
- **Shadcn/ui**: UI component library

#### Key Components
```typescript
/**
 * @component AuthView
 * - Authentication flows
 * - User registration
 * - Login management
 * 
 * @component BackLogView
 * - Task list management
 * - Drag-and-drop ordering
 * - Task creation
 * 
 * @component SprintView
 * - Sprint management
 * - Sprint planning
 * - Task assignment
 */
```

### Backend Architecture

#### Technologies
- **Supabase**: Backend as a Service
- **PostgreSQL**: Database
- **Next.js API Routes**: API endpoints
- **Supabase Auth**: Authentication
- **Supabase Storage**: File storage

#### Database Schema
```sql
-- Core Tables
profiles (
  id: uuid PK,
  email: string,
  name: string,
  created_at: timestamp
)

projects (
  id: uuid PK,
  name: string,
  slug: string,
  primary_owner: uuid FK(profiles),
  created_at: timestamp
)

project_members (
  id: uuid PK,
  project_id: uuid FK(projects),
  profile_id: uuid FK(profiles),
  role: enum('owner', 'administrator', 'manager', 'member'),
  email: string,
  name: string
)

tasks (
  id: uuid PK,
  project_id: uuid FK(projects),
  title: string,
  description: text,
  status: string,
  member_id: uuid FK(project_members),
  sprint_id: uuid FK(sprints),
  sort_id: integer
)

sprints (
  id: uuid PK,
  project_id: uuid FK(projects),
  name: string,
  description: text,
  start_date: timestamp,
  end_date: timestamp,
  is_completed: boolean
)
```

## API Documentation

### Authentication Endpoints

```typescript
/**
 * POST /api/auth/signUp
 * @body {TSignUpForm} formData
 * @returns {Promise<void>}
 */

/**
 * POST /api/auth/signIn
 * @body {TSignInForm} formData
 * @returns {Promise<void>}
 */
```

### Project Endpoints

```typescript
/**
 * GET /api/projects
 * @returns {Promise<TProject[]>}
 */

/**
 * POST /api/projects
 * @body {TOrgForm} formData
 * @returns {Promise<{slug: string}>}
 */
```

### Task Endpoints

```typescript
/**
 * GET /api/projects/[projectId]/tasks
 * @returns {Promise<TTask[]>}
 */

/**
 * POST /api/projects/[projectId]/tasks
 * @body {TTaskForm} formData
 * @returns {Promise<TTask>}
 */
```

## Custom Hooks

### Project Management

```typescript
/**
 * @hook useGetProjectId
 * @returns {string} projectId
 */

/**
 * @hook useProjectTeam
 * @returns {TProjectMember[]} team
 */
```

### Task Management

```typescript
/**
 * @hook useTasks
 * @returns {TTask[]} tasks
 */

/**
 * @hook useSprints
 * @returns {TSprint[]} sprints
 */
```

## Security

### Authentication
- JWT-based authentication
- Secure password hashing
- Email verification
- Role-based access control

### Data Protection
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting

## Performance

### Optimizations
- Query caching
- Image optimization
- Code splitting
- Lazy loading

### Monitoring
- Error tracking
- Performance metrics
- User analytics
- Server monitoring 