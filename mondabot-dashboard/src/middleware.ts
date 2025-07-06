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
  
  // Construct proper absolute URLs for redirects
  // In production, use the request's origin. In development, use localhost:3000
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = req.headers.get('x-forwarded-proto') || 
                  req.headers.get('x-forwarded-ssl') === 'on' ? 'https' : 
                  host.includes('localhost') ? 'http' : 'https';
  
  // For Railway deployments, ensure we use the correct protocol and host
  const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';
  const baseUrl = isRailway && !host.includes('localhost') 
    ? `https://${host}` 
    : `${protocol}://${host}`;
  
  console.log('Middleware processing:', {
    url: req.url,
    protocol,
    host,
    baseUrl,
    isRailway,
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
    try {
      await auth.protect({
        unauthenticatedUrl: `${baseUrl}/login`,
        unauthorizedUrl: `${baseUrl}/login`,
      });
    } catch (error) {
      console.error('Auth protection error:', error);
      // If auth protection fails, let the request continue
      // This prevents the app from crashing due to auth issues
    }
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