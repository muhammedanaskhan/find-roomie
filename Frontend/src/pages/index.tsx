import Image from 'next/image'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/HomePage/Hero'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from '@/components/Header';


const inter = Inter({ subsets: ['latin'] })

import useCheckAccessTokenExpiryAndUpdate from '@/hooks/useCheckAccessTokenExpiryAndUpdate';

import { useGetUserDataQuery } from '@/queries/profileQueries';
import axios from 'axios';
import { Metadata } from 'next';
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout';

export const metadata: Metadata = {
  title: 'findroomie',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};


export default function Home({ userData }: any) {

  return (
    <SharedHeaderLayout>
      <div className='relative h-lvh flex'>
        <Image src='/bg.jpg' fill={true} alt='bg' className=' hidden lg:flex z-[-2000] fixed opacity-10 overflow-visible' />
        <section
          className='flex flex-1 justify-center items-center mt-16'>
          <Hero />
        </section>
      </div>
    </SharedHeaderLayout>

  )
}

