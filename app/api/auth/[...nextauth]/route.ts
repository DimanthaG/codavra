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
    async jwt({ token, user }) {
      // Add isAdmin flag to the JWT token
      if (user) {
        token.isAdmin = user.email === process.env.ADMIN_EMAIL;
      }
      return token;
    },
    async session({ session, token }) {
      // Add isAdmin flag to the session
      if (session?.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
    async redirect() {
      // Always redirect to the same place to avoid loops
      return '/meeting/create';
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