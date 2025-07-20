---
inclusion: always
---

# Kiro Guidelines for Mondabot Dashboard

## Core Principles

1. **Preserve Working Functionality**: The project is already functional - any changes should enhance, not disrupt existing features.
2. **Respect Dual-Server Architecture**: Maintain strict separation between Next.js frontend and Express backend.
3. **Minimal Intervention**: Make only necessary changes that directly address user requirements.
4. **Test Before Committing**: Verify changes work in the Windows environment with CMD shell before finalizing.

## Do Not Change

- **Architecture**: Never merge the frontend and backend servers or convert to static export
- **Core Technology Choices**: Next.js, Express, Airtable integration, Socket.IO, Clerk authentication
- **Project Structure**: Maintain the established directory structure and file organization
- **Build System**: Keep the existing build and deployment processes intact
- **Environment Variables**: Preserve the environment variable structure and naming conventions

## Modification Guidelines

When making changes:

1. **Frontend Changes**: 
   - Keep changes within the `mondabot-dashboard/` directory
   - Follow the established component structure
   - Maintain Tailwind styling conventions and color palette
   - Preserve TypeScript typing

2. **Backend Changes**:
   - Keep changes within the `server/` directory
   - Maintain Express routing patterns
   - Preserve Airtable integration approach
   - Ensure Socket.IO real-time functionality remains intact

3. **Script Changes**:
   - Ensure Windows compatibility (CMD shell)
   - Test scripts before finalizing changes

## Testing Requirements

Before completing any task:

1. Verify changes work in Windows environment
2. Ensure both frontend and backend still function together
3. Test real-time functionality if modified
4. Verify authentication flow if affected

## Documentation

When adding new features or making significant changes:

1. Document the purpose and functionality
2. Update relevant README sections if necessary
3. Include comments in code for complex logic

## Error Handling

- Maintain proper error handling for API calls
- Ensure user-friendly error messages
- Preserve logging patterns

## Performance Considerations

- Keep bundle sizes optimized
- Maintain efficient data fetching patterns with SWR
- Preserve caching strategies