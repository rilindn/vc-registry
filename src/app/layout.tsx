
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth';

import { authOptions } from "./api/auth/[...nextauth]/route";
import { NextAuthProvider } from './context/NextAuthProvider';
import './globals.css'
import Header from '@/components/Header/Header';

const inter = Inter({ subsets: ['latin'] })
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Thought Bank',
  description: 'Powered by Thought Bank',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className='min-h-screen'>
        <Analytics/>
        <NextAuthProvider session={session}>
          {!!session && <Header/>}
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
