'use client'

import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react';

import { authOptions } from "./api/auth/[...nextauth]/route";
import ConfirmEmailDialog from "../components/Home/ConfirmEmailDialog/ConfirmEmailDialog";
import Button from "@/components/Buttons/Button/Button";
import HomeBody from "@/components/Home/HomeBody/HomeBody";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default async function Home() {
  const { data: session } = useSession()

  if (!session) {
    redirect('/auth/login')
  }

  if (!session?.user?.emailVerified) {
    console.log('session?.user', session?.user)
    return <ConfirmEmailDialog />
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <section className="flex flex-col items-center">
        <div className="w-3/4 my-6 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-200">You are signed in as <b>{session?.user?.email}</b></p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Role: <b>{session?.user?.role}</b></p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Account verified: <b>{session?.user?.emailVerified ? '✅' : '❌'}</b></p>
        </div>
        <div className="w-3/4 my-6 p-6 dark:text-gray-300 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <HomeBody />
        </div>
      </section>
    </ThemeProvider>
  );
}