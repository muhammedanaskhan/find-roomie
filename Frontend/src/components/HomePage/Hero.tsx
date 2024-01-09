import Image from 'next/image'
import React from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Input } from "@/components/ui/input"
import { Button } from '../ui/button'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from 'next/link'

function Hero() {
  return (
    <div className='w-3/4 max-w-screen-2xl gap-16 flex flex-row items-center h-96'>
      <div className='flex flex-col w-2/4 align-left justify-left text-left gap-8'>
        <div className='flex flex-col gap-4'>
          <p className='font-extrabold text-start text-5xl'>Find A <span className='text-primaryBlue'>Perfect Roommate</span>: Your Ideal Match Awaits!</p>
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
            className="text-start text-2xl font-josefin-sans w-full text-neutral-700"
          />
        </div>
        <div className='flex flex-col gap-4'>
          <div className="flex w-full gap-4  items-center space-x-2 relative">
            <Input type="text" placeholder="Search Places..."></Input>
            <Button className='px-12 bg-primaryBlue shadow-xl shadow-blueSpreadedShadow' type="submit">Search</Button>
          </div>
          <p className='text-slate-500'>
            <span className='font-bold'>Top cities: </span>
            <Link href='/'>Bengaluru, </Link>
            <Link href='/'>Heydrabad, </Link>
            <Link href='/'>Pune.</Link>
          </p>
        </div>

      </div>
      <div className='h-full w-2/4 relative'>
        <Image layout='fill' objectFit='contain' src='/phone_video_call.webp' alt='vector' />
      </div>

    </div>
  )
}

export default Hero