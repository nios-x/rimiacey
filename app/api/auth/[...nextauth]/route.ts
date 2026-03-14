import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  providers: [  
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
}

const options = {
  callbacks: {
    async signIn({ account, profile }:any) {
      if (account.provider === "google") {
        console.log(
          "Google profile:", profile,
          account
        )
        return profile.email_verified && profile.email.endsWith("@example.com")
      }
      return true 
    },
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };