# Project Structure & Organization

## Overview
The Mondabot Dashboard uses a dual-server architecture with a clear separation between frontend and backend components. This structure allows for independent scaling and development of each part.

## Root Directory Structure
```
mondabot-dashboard/                # Root project directory
├── mondabot-dashboard/            # Next.js Frontend
├── server/                        # Express Backend
├── scripts/                       # Utility scripts
├── pages/                         # Legacy pages (if any)
├── src/                           # Source code
├── Dockerfile                     # Docker configuration
├── railway.json                   # Railway deployment config
├── package.json                   # Root package.json
└── README.md                      # Project documentation
```

## Frontend Structure (mondabot-dashboard/)
```
mondabot-dashboard/
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.tsx               # Home page
│   │   ├── dashboard/             # Dashboard pages
│   │   ├── login/                 # Authentication pages
│   │   └── signup/                # User registration
│   ├── components/                # React components
│   ├── hooks/                     # Custom React hooks
│   └── utils/                     # Utility functions
├── public/                        # Static assets
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── package.json                   # Frontend dependencies
└── .env.local                     # Frontend environment variables
```

## Backend Structure (server/)
```
server/
├── server.js                      # Main Express server file
├── package.json                   # Backend dependencies
├── .env                           # Backend environment variables
└── .env.example                   # Environment variables template
```

## Scripts Directory (scripts/)
```
scripts/
├── check-server.js                # Server connectivity check
├── start-dev.js                   # Development startup script
├── start-dev.ps1                  # Windows development startup
├── start-production.js            # Production startup script
├── test-deployment.js             # Deployment testing
├── test-railway-build.js          # Railway build testing
├── test-static-serving.js         # Static file serving test
└── verify-setup.ps1               # Setup verification script
```

## Key Files

### Configuration Files
- **next.config.ts**: Next.js configuration including API proxy to backend
- **tailwind.config.ts**: Tailwind CSS theme and plugin configuration
- **railway.json**: Railway deployment configuration
- **Dockerfile**: Docker container configuration for deployment
- **nodemon.json**: Backend development auto-reload configuration

### Package Files
- **Root package.json**: Workspace scripts and dependencies
- **mondabot-dashboard/package.json**: Frontend dependencies
- **server/package.json**: Backend dependencies

## Code Organization Principles

### Frontend Organization
- **Pages**: Organized by feature/route in the app directory
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for shared logic
- **Utils**: Helper functions and utilities

### Backend Organization
- **Single server.js file**: Contains all Express routes and middleware
- **Environment-based configuration**: Different behavior in dev/prod

## Data Flow

1. **Frontend Request**: User interacts with React components
2. **API Call**: Frontend makes HTTP requests to Express backend
3. **Airtable Query**: Backend queries Airtable API using SDK
4. **Data Processing**: Backend processes and formats Airtable data
5. **Response**: Formatted data sent back to frontend
6. **Real-time Updates**: WebSocket broadcasts changes to all connected clients

## Development Guidelines

- Keep frontend and backend code strictly separated
- Use the appropriate directory for each type of code
- Follow the established naming conventions
- Maintain clear separation of concerns
- Use the scripts directory for utility scripts
- Keep configuration in the appropriate files
- Follow the data flow pattern for new features