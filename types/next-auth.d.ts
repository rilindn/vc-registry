import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module 'next-auth' {
  interface Session {
    user: {
      "@id": string
      id: string
      name: string
      email: string
      verificationCode: string,
      emailVerified: boolean,
      role: string,
      'person:did'?: [{
        "@id"?: string
        "@type"?: string
      }],
      "person:vc"?:[{
        "@id"?: string
        "@type"?: string
      }]
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    "@id": string
    id: string
    name: string
    email: string
    password: string,
    verificationCode: string,
    emailVerified: boolean,
    role: string,
    "person:vc"?:[{
      "@id"?: string
      "@type"?: string
    }]
  } 
}

