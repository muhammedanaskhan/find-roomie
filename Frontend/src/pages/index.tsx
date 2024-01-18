import Image from 'next/image'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/HomePage/Hero'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <section className=' bg-background200 flex flex-1 justify-center items-center'>
      <Hero/>
    </section>

  )
}
