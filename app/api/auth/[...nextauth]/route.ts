import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log('JWT Callback - Initial sign in:', { user, account });
        return {
          ...token,
          isAdmin: user.email === process.env.ADMIN_EMAIL,
        };
      }
      console.log('JWT Callback - Token refresh:', { token });
      // Ensure isAdmin is always a boolean
      if (typeof token.isAdmin !== 'boolean') {
        token.isAdmin = token.email === process.env.ADMIN_EMAIL;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback:', { session, token });
      if (!session?.user) return session;
      
      // Add isAdmin flag to the session
      session.user.isAdmin = Boolean(token.isAdmin) || session.user.email === process.env.ADMIN_EMAIL;
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect Callback:', { url, baseUrl });
      
      // Handle relative URLs
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`;
        console.log('Converting relative URL to absolute:', fullUrl);
        return fullUrl;
      }
      
      // Handle absolute URLs that match the baseUrl
      if (url.startsWith(baseUrl)) {
        console.log('Using provided absolute URL:', url);
        return url;
      }
      
      // Default to /meeting/create for non-admin users
      if (!url.includes('/admin/')) {
        const defaultUrl = `${baseUrl}/meeting/create`;
        console.log('Using default redirect URL:', defaultUrl);
        return defaultUrl;
      }
      
      console.log('Falling back to baseUrl:', baseUrl);
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 