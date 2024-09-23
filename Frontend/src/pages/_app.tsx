import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { Barlow_Condensed, Inter, Josefin_Sans, Lemon, Montserrat } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Nav from '@/components/Nav/Nav';

import useRouter from 'next/router';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import Header from '@/components/Header';

import NProgress from "nprogress";
import '../styles/nprogress.css';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '@/Redux/store';
import { useEffect, useState } from 'react';
import useCheckAccessTokenExpiryAndUpdate from '@/hooks/useCheckAccessTokenExpiryAndUpdate';
import axios from 'axios';
import { useGetUserDataQuery } from '@/queries/profileQueries';
import { setAuth } from '@/Redux/authSlice';

const barlowCondensed = Barlow_Condensed({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin-sans',
});

const lemon = Lemon({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-lemon',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-montserrat',
})

const router = useRouter;

router.events.on('routeChangeStart', () => NProgress.start())
router.events.on('routeChangeComplete', () => NProgress.done())
router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient()
  useCheckAccessTokenExpiryAndUpdate();

  return (
    <Provider store={store}>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent Component={Component} pageProps={pageProps} />
        </QueryClientProvider>
      </ChakraProvider>
    </Provider>
  );
}

function AppContent({ Component, pageProps }: any) {

  const dispatch = useDispatch();

  const { mutateAsync: getUser } = useGetUserDataQuery();

  const { userName, email, avatar, isUserAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {

    if (isUserAuthenticated) {
      return; // Skip fetching if user is already authenticated
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return;
    } else {

      const fetchGetUser = async () => {
        const result = await getUser();
        dispatch(setAuth({
          userName: result.data.fullName,
          email: result.data.email,
          accessToken: accessToken,
          isUserAuthenticated: true,
          avatar: result.data.avatar
        }))
      }
      fetchGetUser()
    }
  }, []);

  return (
    <main
      className={`${inter.variable} ${montserrat.variable} ${barlowCondensed.variable} ${josefinSans.variable} ${lemon.variable} ${GeistMono.variable} ${GeistSans.variable} flex flex-col h-screen`}>
      <Component {...pageProps} />
    </main>
  )
}