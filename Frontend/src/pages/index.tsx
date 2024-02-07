import Image from 'next/image'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/HomePage/Hero'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <Header />
      <div className='relative h-lvh flex'>
        <Image src='/bg.jpg' fill={true} alt='bg' className=' hidden lg:flex z-0 fixed opacity-10 overflow-visible' />
        <section
          className='flex flex-1 justify-center items-center mt-16'>
          <Hero />
        </section>
      </div>
    </div>



  )
}
