import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { Barlow_Condensed, Inter, Josefin_Sans, Lemon } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Nav from '@/components/Nav/Nav';

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


export default function App({ Component, pageProps }: AppProps) {
  return (
  
        <main	
          className={`${inter.variable} ${barlowCondensed.variable} ${josefinSans.variable} ${lemon.variable} ${GeistMono.variable} ${GeistSans.variable}`}
        >
           <Nav/>
          <Component {...pageProps} />
        </main>
      );	
    }