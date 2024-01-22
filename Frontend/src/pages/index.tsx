import Image from 'next/image'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/HomePage/Hero'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <section className=' bg-background200 flex flex-1 justify-center items-center'>
      <Hero/>
    </section>

  )
}
