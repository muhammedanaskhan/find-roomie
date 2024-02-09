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

function PersonalDetails() {

  const [gender, setGender] = useState<string | null>(null)
  const handleSelectGender = (gender: string) => {
    setGender(gender)
  }

  const fileTypes = ["JPG", "PNG"];

  const [file, setFile] = useState<File>();
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);


  const handleChange = (file: File) => {
    setFile(file);
    setIsModalOpen(true)
    console.log(file);
  };

  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  console.log("file", croppedImageFile);

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
    if(selectedPreferences == null){
      setSelectedPreferences([preference])
    }else{
      if(selectedPreferences.includes(preference)){
        setSelectedPreferences(selectedPreferences.filter(item => item!== preference))
      }else{
        setSelectedPreferences([...selectedPreferences, preference])
      }
    }
  }

  return (
    <div className='w-1/2'>
      <Card className=" p-6 sm:p-10 lg:p-20 ">
        <div className='flex flex-col gap-6 '>
          <div className='flex justify-between items-center'>
            <p className='font-semibold'>Your Gender</p>
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
            <p className='font-semibold'>City</p>
            <div className=''>
              <Dropdown />
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
                      className={`h-8 flex justify-center items-center px-6 border-2 rounded-xl border-slate-200 ${selectedPreferences?.includes(preference) ? 'bg-black text-white' : '' }`}
                      onClick={() => handleSelectPreference(preference)}>
                      {preference}
                    </button>
                  )
                })
              }
            </div>
          </div>
          <Button className='w-1/2 left-0 right-0 m-auto mt-6'>
            Continue
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PersonalDetails




{/* <div>
<input type="file" accept=".jpg, .png, .jpeg" className='hidden'></input>
  <div>
    <button className="mt-2 md:mt-0 border border-gray-200 rounded-md w-full h-24 flex flex-col justify-center items-center text-xs text-gray-500">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="w-8 h-8 text-gray-400 mb-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path>
        <path d="m8 11-3 4h11l-4-6-3 4z"></path>
        <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path>
      </svg>
      Click or Drop to upload profile image (jpg or png)
    </button>
  </div>
  <div className="my-3 md:my-5 text-center text-gray-500 text-sm">-- OR --</div>
  <div className="grid grid-cols-4">
    <div className="relative w-16 h-16">
      <img src="https://www.flatmate.in/api/ranbasera/app/images/avatar/male-3.jpg" alt="avatar" className="w-16 h-16 rounded-full bg-gray-200 cursor-pointer transform false"/>
    </div>
    <div className="relative w-16 h-16">
      <img src="https://www.flatmate.in/api/ranbasera/app/images/avatar/male-27.jpg" alt="avatar" className="w-16 h-16 rounded-full bg-gray-200 cursor-pointer transform false"/>
    </div>
    <div className="relative w-16 h-16">
      <img src="https://www.flatmate.in/api/ranbasera/app/images/avatar/male-24.jpg" alt="avatar" className="w-16 h-16 rounded-full bg-gray-200 cursor-pointer transform false"/>
    </div>
    <div className="relative w-16 h-16">
      <img src="https://www.flatmate.in/api/ranbasera/app/images/avatar/male-19.jpg" alt="avatar" className="w-16 h-16 rounded-full bg-gray-200 cursor-pointer transform false"/>
    </div>
  </div>
</div> */}