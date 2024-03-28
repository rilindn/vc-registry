import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { findUser } from '../../../../../lib/api/FlureeMethods';


export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "text", placeholder: "rilind@gmail.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          if (!credentials?.email || !credentials.password) return null
          const user = await findUser(credentials.email)
          console.log("🚀 ~ authorize ~ user:", user)
  
          if (!user) return null
          const verifyCredentials = await bcrypt.compare(credentials?.password, user.password);
    
          // If no error and we have user data, return it
          if (verifyCredentials) {
            return user
          }
          // Return null if user data could not be retrieved
          return null
        }
      })
    ],
    callbacks: {
      async jwt({token, user, trigger}: any) {
        if (trigger === "update") {
          const userData = await findUser(token?.email)
          const {password, ...otherData} = userData
          return { ...token, ...otherData }
        }
        return {...token, ...user}
      },
      async session({ session, token }) {
          const {password, ...otherData} = token
          session.user = otherData
          return session; 
      }
    },
    pages: {
      signIn: '/auth/login'
    }
  }