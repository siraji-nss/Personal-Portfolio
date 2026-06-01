import { withAuth } from 'next-auth/middleware';

// Protect all /admin/* routes except /admin/login itself.
// next-auth/middleware checks the JWT and redirects to signIn if missing.
export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

export const config = {
  // Match every /admin path EXCEPT login, forgot-password, and reset-password
  matcher: ['/admin/((?!login$|forgot-password$|reset-password).*)'],
};
