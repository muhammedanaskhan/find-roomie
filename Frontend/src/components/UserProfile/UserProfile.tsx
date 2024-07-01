import React, { useEffect, useState } from 'react'

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
import { FileUploader } from 'react-drag-drop-files'

import styles from "./AvatarCropPopup.module.css";
import AvatarCropPopup from './AvatarCropPopup'
import Image from 'next/image'

import toast, { Toaster } from 'react-hot-toast'
import NProgress, { set } from "nprogress";

import { useAuthenticateUserQuery, useGetUserDataQuery, useUpdateUserDataQuery } from '@/queries/profileQueries'
import { Router, useRouter } from 'next/router' 
import Link from 'next/link'
import { Input } from '../ui/input'



function UserProfile() {

  const { mutateAsync: getUser } = useGetUserDataQuery();

  //fetch exixting data
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
    } else {
      const fetchUserData = async () => {
        try {
          const result = await getUser();
          setUsername(result.data.fullName);
          const fetchedFirstName = result.data.fullName.split(' ')[0]
          const fetchedLastName = result.data.fullName.split(' ')[1]
          setFirstName(fetchedFirstName)
          setLastName(fetchedLastName)
          setGender(result.data.gender);
          setCity(result.data.city);
          setPreferences(result.data.preferences)

          console.log('User data:', result.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);


  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const[preferences, setPreferences] = useState<string[] | null>(null)

  const router = useRouter();

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value)
  }


  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value)
  }

  type Gender = 'Male' | 'Female' | null

  const handleSelectGender = (gender: string) => {
    setGender(gender)
  }

  const handleSelectCity = (value: string) => {
    setCity(value)
    console.log('City:', value);
  }

  const allPreferences: Array<string> = [
    'Non Smoker',
    'Non Alcoholic',
    'Nomad',
    'Introvert',
    'Nerd',
    'Pet Friendly',
    'Vegetarian',
    'Gym Fanatic',
    'Gamer',
    'Early Bird',
    'Night Owl',
    'Fitness Freak',
    'Partygoer',
    'Music Lover',
    'Minimalist',
    'Foodie',
    'Remote Worker',
    'Tech Geek',
    'Religious',
    'Clean Freak'
  ]

  const handleSelectPreference = (preference: string) => {
    if (preferences == null) {
      setPreferences([preference])
    } else {
      if (preferences.includes(preference)) {
        setPreferences(preferences.filter(item => item !== preference))
      } else {
        setPreferences([...preferences, preference])
      }
    }
  }

  const { mutateAsync: updateUser } = useUpdateUserDataQuery();

  const handleSubmit = async () => {

    if(firstName == null){
      toast.error('Enter your first name')
    }
    else if(lastName == null){
      toast.error('Enter your last name')
    }
    else if (gender == null) {
      toast.error('Select your gender')
    } else if (city == null) {
      toast.error('Select your city')
    }
    else if (!preferences || preferences.length === 0) {
      toast.error('Select your preferences')
    } else if (preferences?.length < 5) {
      toast.error('Select At least 5 preferences')
    }
    else {
      try {

        NProgress.start();

        const fullName = `${firstName} ${lastName}`
        const result = await updateUser(
          {
            fullName: fullName,
            gender: gender,
            city: city,
            preferences: preferences
          },
        )
        NProgress.done();

        if (result.statusCode === 200) {
          localStorage.setItem('isUserAuthenticated', "true")
          toast.success(`Profile Updated successfully!`)
          router.push('/')
        }
      } catch (error) {

      }
    }
  }

  return (
    <div className='sm:w-3/4 lg:w-1/2'>
      <Toaster />
      <Card className="mt-8 md:mt-0 p-6 sm:p-10 lg:p-12 ">
        <p className='text-4xl font-bold mb-6 h-16 border-b-2'>Profile</p>
        <div className='flex flex-col gap-6 '>
          <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
            <p className=' w-full lg:w-fit text-left font-semibold mb-0'>First Name</p>
            <div className='w-full flex gap-4 lg:w-52'>
              <Input placeholder="j_doe" value={firstName} onChange={handleFirstNameChange} />
            </div>
          </div>
          <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
            <p className=' w-full lg:w-fit text-left font-semibold'>Last Name</p>
            <div className='w-full flex gap-4 lg:w-52'>
              <Input placeholder="j_doe" value={lastName} onChange={handleLastNameChange} />
            </div>
          </div>
          <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
            <p className=' text-left w-full font-semibold'>Your Gender</p>
            <div className='w-full flex gap-4 lg:w-52'>
              <Button
                variant={gender === 'Male' ? 'default' : 'secondary'}
                className={`w-full lg:w-24 ${gender === 'Male' ? 'bg-primaryBlue hover:bg-primaryBlue' : ''}`}
                onClick={() => handleSelectGender('Male')}>
                Male
              </Button>
              <Button
                variant={gender === 'Female' ? 'default' : 'secondary'}
                className={`w-full lg:w-24 ${gender === 'Female' ? 'bg-primaryBlue hover:bg-primaryBlue' : ''}`}
                onClick={() => handleSelectGender('Female')}>
                Female
              </Button>
            </div>
          </div>
          <div className='flex flex-col gap-4 lg:flex-row justify-between items-center'>
            <p className='text-left w-full lg:w-min font-semibold'>City</p>
            <div className='w-full flex gap-4 lg:w-52'>
              <Dropdown onSelectValue={handleSelectCity} fetchedCity={city} />
            </div>
          </div>
       
          <div className='flex flex-col justify-between items-center'>
            <p className='text-left w-full font-semibold'>Select Preferences: </p>
            <div className='flex w-full flex-wrap gap-2 mt-6 justify-center'>
              {
                allPreferences?.map((preference, index) => {
                  return (
                    <button
                      className={`h-8 flex hover:transform hover:scale-105 transition-transform duration-100 ease-in-out justify-center items-center px-6 border-2 rounded-xl border-slate-200 ${preferences?.includes(preference) ? 'bg-primaryBlue text-white border-primaryBlue' : ''}`}
                      onClick={() => handleSelectPreference(preference)}>
                      {preference}
                    </button>
                  )
                })
              }
            </div>
          </div>
          <Button className='w-full sm:w-1/2 left-0 right-0 m-auto mt-6 bg-primaryBlue hover:bg-primaryBlue'
            onClick={handleSubmit}
            >
            Update Profile
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default UserProfile
