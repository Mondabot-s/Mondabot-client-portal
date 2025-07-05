import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/',
  '/dashboard(.*)',
  '/automations(.*)',
  '/tasks(.*)',
  '/referrals(.*)',
  '/updates(.*)',
  '/api(.*)',
])

// Create matcher for public routes (routes that should NOT be protected)
const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/signup(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/verify-email-address(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Allow all routes to work without authentication for now
  // This ensures the dashboard loads properly
  console.log('Middleware processing:', req.url);
  
  // Only protect routes if:
  // 1. Clerk is properly configured 
  // 2. The route is not public
  // 3. The route is marked as protected
  // 4. User explicitly wants authentication (can be enabled later)
  const shouldProtect = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                       !isPublicRoute(req) && 
                       isProtectedRoute(req) &&
                       process.env.ENABLE_AUTHENTICATION === 'true'; // Add this env var to enable auth
  
  if (shouldProtect) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
} 