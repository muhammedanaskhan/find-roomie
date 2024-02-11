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
import { useAuthenticateUserQuery } from '@/queries/profileQueries'

function PersonalDetails() {

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
    console.log("file", file)
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

      const result = await authenticateUser(
        {
          gender: gender,
          city: city,
          avatar: file,
          preferences: selectedPreferences
        }
      )
      console.log(result)
    }
  }

  return (
    <div className='w-1/2'>
      <Toaster />
      <Card className=" p-6 sm:p-10 lg:p-20 ">
        <div className='flex flex-col gap-6 '>
          <div className='flex justify-between items-center'>
            <p className='font-semibold'>Your Gender</p>
            <div className='flex gap-4'>
              <Button
                variant={gender === 'Male' ? 'default' : 'secondary'}
                className={`w-24 ${gender === 'Male' ? 'bg-primaryBlue' : ''}`}
                onClick={() => handleSelectGender('Male')}>
                Male
              </Button>
              <Button
                variant={gender === 'Female' ? 'default' : 'secondary'}
                className={`w-24 ${gender === 'Female' ? 'bg-primaryBlue' : ''}`}
                onClick={() => handleSelectGender('Female')}>
                Female
              </Button>
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <p className='font-semibold'>City</p>
            <div className=''>
              <Dropdown onSelectValue={handleSelectCity} />
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <p className='font-semibold'>Avatar</p>
            <div>
              {file
                ?
                <div className='min-w-52'>
                  <div className='relative w-20 h-20'>
                    <Image src='/cancel.svg' onClick={resetCroppedImage} className='absolute rounded-full border-black bg-white right-2 cursor-pointer' width={18} height={18} alt="avatar/>" />
                    {croppedImageFile && <Image src={URL.createObjectURL(croppedImageFile)} className='rounded-full ' width={80} height={80} alt="avatar" />}
                  </div>

                </div>
                :
                <FileUploader className={styles.labell} label='Upload or Drop' handleChange={handleChange} name="file" types={fileTypes} />}
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
          <Button className='w-1/2 left-0 right-0 m-auto mt-6 bg-primaryBlue'
            onClick={handleSubmit}>
            Continue
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PersonalDetails
