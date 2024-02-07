import { LoginForm } from '@/components/LoginForm/LoginForm'
import useProtectAuthPages from '@/hooks/useProtectAuthPages'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function index() {

  useProtectAuthPages();

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='fixed top-12'>
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image width={32} height={32} src="/findroomieIcon.webp" className="h-8" alt="Flowbite Logo" priority />
          <span className="self-center text-2xl font-lemon  whitespace-nowrap dark:text-white ">findroomie</span>
        </Link>
      </div>

      <LoginForm />
    </div>
  )
}

export default index