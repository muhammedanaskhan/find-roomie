import PersonalDetails from '@/components/PersonalDetails/PersonalDetails'
import React from 'react'

function index() {
  return (
    <div className='w-full h-screen flex justify-center items-center bg-light-blue-gradient bg-no-repeat bg-opacity-20 bg-white bg-cover backdrop-blur-lg shadow-lg'>
      <PersonalDetails/>
    </div>
  )
}

export default index