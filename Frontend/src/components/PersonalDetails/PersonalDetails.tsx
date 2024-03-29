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
import { FileUploader } from 'react-drag-drop-files'

import styles from "./AvatarCropPopup.module.css";
import AvatarCropPopup from './AvatarCropPopup'
import Image from 'next/image'

import toast, { Toaster } from 'react-hot-toast'
import NProgress from "nprogress";

import { useAuthenticateUserQuery } from '@/queries/profileQueries'
import { Router, useRouter } from 'next/router'
import Link from 'next/link'



function PersonalDetails() {

  const router = useRouter();

  type Gender = 'Male' | 'Female' | null

  const [gender, setGender] = useState<Gender | null>(null)

  const handleSelectGender = (gender: Gender) => {
    setGender(gender)
  }

  const [city, setCity] = useState<string | null>(null)

  const handleSelectCity = (value: string) => {
    setCity(value)
  }

  const fileTypes = ["JPG", "PNG"];

  const [file, setFile] = useState<File>();


  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);


  const handleChange = (file: File) => {
    setFile(file);
    setIsModalOpen(true)
  };

  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }


  const resetCroppedImage = () => {
    setCroppedImageFile(null)
    setFile(undefined)
  }

  const [selectedPreferences, setSelectedPreferences] = useState<string[] | null>(null)

  const preferences: Array<string> = [
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
    if (selectedPreferences == null) {
      setSelectedPreferences([preference])
    } else {
      if (selectedPreferences.includes(preference)) {
        setSelectedPreferences(selectedPreferences.filter(item => item !== preference))
      } else {
        setSelectedPreferences([...selectedPreferences, preference])
      }
    }
  }


  const { mutateAsync: authenticateUser } = useAuthenticateUserQuery();

  const handleSubmit = async () => {


    if (gender == null) {
      toast.error('Select your gender')
    } else if (city == null) {
      toast.error('Select your city')
    } else if (file == null) {
      toast.error('Upload your profile picture')
    } else if (!selectedPreferences || selectedPreferences.length === 0) {
      toast.error('Select your preferences')
    } else if (selectedPreferences?.length < 5) {
      toast.error('Select At least 5 preferences')
    }
    else {

      try {

        NProgress.start();

        const result = await authenticateUser(
          {
            gender: gender,
            city: city,
            avatar: croppedImageFile,
            preferences: selectedPreferences
          }
        )

        NProgress.done();
        toast.success(`Your details are saved!`)
        if (result.statusCode === 200) {
          localStorage.setItem('isUserAuthenticated', "true")
          router.push('/')
        }
      } catch (error) {

      }
    }
  }

  return (
    <div className='w-3/4 lg:w-1/2'>
      <Toaster />
      <Card className=" p-6 sm:p-10 lg:p-12 ">
        <div className='flex justify-center items-center mb-8'>
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* <Image width={32} height={32} src="/findroomieIcon.webp" className="h-8" alt="Flowbite Logo" priority /> */}
            <span className="self-center text-2xl font-lemon  whitespace-nowrap dark:text-white ">findroomie</span>
          </Link>
        </div>
        <div className='flex flex-col gap-6 '>
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
              <Dropdown onSelectValue={handleSelectCity} />
            </div>
          </div>
          <div className='flex gap-4 flex-col lg:flex-row justify-between items-center'>
            <p className='text-left w-full lg:w-min font-semibold'>Avatar</p>
            <div className='w-full lg:w-52'>
              {file
                ?
                <div className='min-w-52'>
                  <div className='relative w-20 h-20'>
                    <Image src='/cancel.svg' onClick={resetCroppedImage} className='absolute rounded-full border-black bg-white right-2 cursor-pointer' width={18} height={18} alt="avatar/>" />
                    {croppedImageFile && <Image src={URL.createObjectURL(croppedImageFile)} className='rounded-full ' width={80} height={80} alt="avatar" />}
                  </div>

                </div>
                :
                <div className='w-full'>
                  <FileUploader className={styles.labell} label='Upload or Drop' handleChange={handleChange} name="file" types={fileTypes} />
                </div>
              }
              {isModalOpen && <AvatarCropPopup file={file} closeModal={closeModal} onCroppedImageFile={setCroppedImageFile} />}
            </div>
          </div>
          <div className='flex flex-col justify-between items-center'>
            <p className='text-left w-full font-semibold'>Select Preferences: </p>
            <div className='flex w-full flex-wrap gap-2 mt-6 justify-center'>
              {
                preferences.map((preference, index) => {
                  return (
                    <button
                      className={`h-8 flex hover:transform hover:scale-105 transition-transform duration-100 ease-in-out justify-center items-center px-6 border-2 rounded-xl border-slate-200 ${selectedPreferences?.includes(preference) ? 'bg-primaryBlue text-white border-primaryBlue' : ''}`}
                      onClick={() => handleSelectPreference(preference)}>
                      {preference}
                    </button>
                  )
                })
              }
            </div>
          </div>
          <Button className='w-full sm:w-1/2 left-0 right-0 m-auto mt-6 bg-primaryBlue hover:bg-primaryBlue'
            onClick={handleSubmit}>
            Continue
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PersonalDetails
