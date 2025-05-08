import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session?.user) return session;
      
      // Add isAdmin flag to the session
      session.user.isAdmin = session.user.email === process.env.ADMIN_EMAIL;
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Handle absolute URLs that match the baseUrl
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default to /meeting/create for non-admin users
      if (!url.includes('/admin/')) {
        return `${baseUrl}/meeting/create`;
      }
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 