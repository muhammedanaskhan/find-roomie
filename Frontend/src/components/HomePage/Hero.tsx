import Image from 'next/image'
import React from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Input } from "@/components/ui/input"
import { Button } from '../ui/button'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from 'next/link'


import toast, { Toaster } from 'react-hot-toast';


function Hero() {

  const notify = () => toast.success('Successfully toasted!')



  return (
    <div className='w-10/12 lg:w-5/6 max-w-6xl gap-12 flex flex-row justify-between items-center h-96'>
      <div className='flex flex-col w-96 align-left justify-left text-left gap-8'>
        <div className='flex flex-col gap-2 sm:gap-6 z-20'>
          <p className='text-4xl font-extrabold text-start sm:text-5xl'>Find A <span className='text-primaryBlue'>Perfect Roommate</span>: Your Ideal Match Awaits!</p>
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              'Connect Professionally, Live Comfortably!',
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              'Find like-minded individuals to live with!',
              1000,
              'Reach out to roomates in your locality!',
              1000,
            ]}
            wrapper="p"
            cursor={true}
            repeat={Infinity}
            className="text-base text-start md:text-xl font-josefin-sans w-full text-neutral-700"
          />
        </div>
        <div className='flex flex-col gap-4'>
          <div className="flex flex-col md:flex-row w-full gap-4  items-center space-x-2 relative">
            <Input type="text" placeholder="Search Places..."></Input>
            <Button className='w-full md:w-10 px-12 bg-primaryBlue shadow-xl shadow-blueSpreadedShadow' type="submit">Search</Button>
            <button onClick={notify}>Make me a toast</button>
            <Toaster />
         
         
          </div>
          <p className='text-slate-500'>
            <span className='font-bold'>Top cities: </span>
            <Link href='/'>Bengaluru, </Link>
            <Link href='/'>Heydrabad, </Link>
            <Link href='/'>Pune.</Link>
          </p>
        </div>

      </div>
      <div className='hidden lg:flex h-full w-2/4 relative'>
        <Image layout='fill' objectFit='contain' src='/games-time.svg' alt='vector' />
      </div>

    </div>
  )
}

export default Hero