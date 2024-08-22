import { LoginForm } from '@/components/LoginForm/LoginForm'
import useProtectAuthPages from '@/hooks/useProtectAuthPages'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function index() {

  return (
    <div className='w-full h-screen flex justify-center items-center  bg-opacity-20 bg-white bg-cover backdrop-blur-lg shadow-lg'>
      <LoginForm />
    </div>
  )
}

export default index