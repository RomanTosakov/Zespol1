# 🚀 Jira-like Project Management System

Welcome to our project management system! This guide will help you get started with setting up and running the project.

## 📋 Table of Contents
- [quick start](docs/quick-start.md)
- [Branch Structure](docs/user-guide.md)
- [Project Structure](docs/project-structure.md)


## 🛠 Prerequisites

Before you begin, make sure you have the following installed on your computer:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Yarn](https://yarnpkg.com/) (preferred package manager)
- [Git](https://git-scm.com/) for cloning the repository
- [Docker](https://www.docker.com/) for local database

## 🌳 Branch Structure

The project uses the following branch structure:

- `main` - Production branch, contains stable code
- `develop` - Development branch, contains latest features
- `feature/[feature-name]` - For new features (e.g., `feature/task-management`)
- `bugfix/[bug-name]` - For bug fixes (e.g., `bugfix/login-issue`)
- `hotfix/[fix-name]` - For urgent production fixes

To start working on a new feature:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

For bug fixes:
```bash
git checkout develop
git pull origin develop
git checkout -b bugfix/bug-description
```

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Zespol1-1.git
cd Zespol1-1
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Set Up local database
[install supabase cli](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=windows#installing-the-supabase-cli)
then run 
``` bash
supabase start
```
### 4. Start the Development Server
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

The project follows a standard Next.js structure:
```
src/
├── components/     # Reusable UI components
├── lib/
│   ├── types/     # TypeScript type definitions
│   ├── utils/     # Utility functions
│   └── views/     # Page-specific components
├── pages/         # Next.js pages and API routes
└── styles/        # Global styles
```

## ✨ Features

- 👥 **User Management**
  - Sign up/Sign in
  - Profile management
  - Team collaboration

- 📊 **Project Management**
  - Create and manage projects
  - Task tracking
  - Sprint planning
  - Backlog management

- 🔄 **Task Management**
  - Create, edit, and delete tasks
  - Assign tasks to team members
  - Track task status
  - Add comments and descriptions

- 👥 **Team Collaboration**
  - Invite team members
  - Role-based access control
  - Real-time updates

## 🧭 Navigation Guide

### Main Sections

1. **Dashboard** (`/projects/dashboard`)
   - View all your projects
   - Accept project invitations
   - Create new projects

2. **Project View** (`/projects/[projectSlug]`)
   - **Backlog** (`/boards/backlog`)
     - View and manage all tasks
     - Create new tasks
     - Drag and drop to reorder tasks
   
   - **Sprints** (`/boards/sprints`)
     - Create and manage sprints
     - Assign tasks to sprints
     - Track sprint progress

   - **Settings** (`/settings`)
     - **Details**: Update project information
     - **Access**: Manage team members and roles
     - **Team**: View team members and send invites

3. **Profile** (`/profile`)
   - View and edit your profile
   - Manage personal settings

### Common Actions

- **Creating a Task**:
  1. Go to Backlog
  2. Click "Create" at the bottom of the task list
  3. Enter task details and save

- **Inviting Team Members**:
  1. Go to Project Settings > Team
  2. Click "Invite Member"
  3. Enter email and select role
  4. Send invitation

- **Managing Sprints**:
  1. Go to Sprints section
  2. Click "New Sprint"
  3. Set sprint details and duration
  4. Add tasks from backlog

## 🆘 Need Help?

If you encounter any issues or need assistance:
1. Check that all environment variables are correctly set
2. Ensure all dependencies are installed
3. Try restarting the development server
4. Contact the development team for support

---

Happy Project Managing! 🎉
