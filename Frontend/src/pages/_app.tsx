import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { Barlow_Condensed, Inter, Josefin_Sans, Lemon } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Nav from '@/components/Nav/Nav';

import Router from 'next/router';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import Header from '@/components/Header';

import NProgress from "nprogress";
import '../styles/nprogress.css';

import { Provider } from 'react-redux';
import { store } from '@/Redux/store';
import { useEffect, useState } from 'react';

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
  variable: '--font-lemon',
});


Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient()

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsUserAuthenticated(false);
    } else {
      setIsUserAuthenticated(true);
    }
}, []);

  return (
    <Provider store={store}>
      <main
        className={`${inter.variable} ${barlowCondensed.variable} ${josefinSans.variable} ${lemon.variable} ${GeistMono.variable} ${GeistSans.variable} flex flex-col h-screen`}
      >
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            {/* <Nav /> */}
            {/* <Header /> */}
            <Component {...pageProps} />
          </QueryClientProvider>
        </ChakraProvider>
      </main>
    </Provider>

  );
}