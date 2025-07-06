import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/',
  '/dashboard(.*)',
  '/automations(.*)',
  '/tasks(.*)',
  '/referrals(.*)',
  '/updates(.*)',
  '/test-page(.*)',
  '/api(.*)',
])

// Create matcher for public routes (routes that should NOT be protected)
const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/signup(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/verify-email-address(.*)',
  '/factor-one(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Check if authentication is enabled (using NEXT_PUBLIC_ prefix for client-side access)
  const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
  
  // Check if Clerk is properly configured
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  console.log('Middleware processing:', {
    url: req.url,
    authEnabled: isAuthEnabled,
    clerkConfigured: !!isClerkConfigured,
    isProtected: isProtectedRoute(req),
    isPublic: isPublicRoute(req)
  });
  
  // Only protect routes if:
  // 1. Authentication is enabled
  // 2. Clerk is properly configured 
  // 3. The route is not public
  // 4. The route is marked as protected
  const shouldProtect = isAuthEnabled && 
                       isClerkConfigured &&
                       !isPublicRoute(req) && 
                       isProtectedRoute(req);
  
  if (shouldProtect) {
    console.log('Protecting route:', req.url);
    await auth.protect({
      unauthenticatedUrl: '/login',
      unauthorizedUrl: '/login',
    });
  } else {
    console.log('Not protecting route:', req.url, {
      reason: !isAuthEnabled ? 'Auth disabled' : 
              !isClerkConfigured ? 'Clerk not configured' :
              isPublicRoute(req) ? 'Public route' :
              !isProtectedRoute(req) ? 'Not protected route' : 'Unknown'
    });
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
} 