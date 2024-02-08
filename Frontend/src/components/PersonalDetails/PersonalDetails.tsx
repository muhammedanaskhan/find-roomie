import React, { useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Dropdown } from './Dropdown'

function PersonalDetails() {

  const [gender, setGender] = useState<string | null>(null)
  const handleSelectGender = (gender: string) => {
    setGender(gender)
  }

  return (
    <div className='w-1/2'>
      <Card className=" p-6 sm:p-10 lg:p-24 ">
        <div className='flex flex-col gap-6 '>
          <div className='flex justify-between items-center'>
            <p>Your Gender</p>
            <div className='flex gap-4'>
              <Button
                variant={gender === 'Male' ? 'default' : 'secondary'}
                className='w-24 '
                onClick={() => handleSelectGender('Male')}>
                Male
              </Button>
              <Button
                variant={gender === 'Female' ? 'default' : 'secondary'}
                className='w-24'
                onClick={() => handleSelectGender('Female')}>
                Female
              </Button>
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <p>Where are you looking for Roomate?</p>
            <div className=''>
              <Dropdown/>
            </div>
          </div>
          <div>
        
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PersonalDetails