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
      // Always allow internal URLs
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        return url;
      }
      // Default to homepage
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 