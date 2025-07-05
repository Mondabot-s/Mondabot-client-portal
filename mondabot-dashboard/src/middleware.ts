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
  // Only protect routes if Clerk is properly configured and the route is not public
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !isPublicRoute(req) && isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
} 