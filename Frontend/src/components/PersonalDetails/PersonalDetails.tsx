import React, { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'


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
import { useDebounce } from '@/hooks/useDebounce'
import { Skeleton } from '../ui/skeleton'



function PersonalDetails() {

  const router = useRouter();

  type Gender = 'Male' | 'Female' | null

  const [gender, setGender] = useState<Gender | null>(null)

  const handleSelectGender = (gender: Gender) => {
    setGender(gender)
  }

  const [country, setCountry] = useState<string>('')
  const [countrySearchSuggestions, setCountrySearchSuggestions] = useState<any[]>([])
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null)
  const [isCountrySuggestionSelected, setIsCountrySuggestionSelected] = useState<boolean>(false)
  const [isCountrySuggestionsLoading, setIsCountrySuggestionsLoading] = useState<boolean>(false)

  const handleCountryChange = (search: string) => {
    setCountrySearchSuggestions([])
    if (search !== '') {
      setIsCountrySuggestionsLoading(true)
    } else {
      setIsCountrySuggestionsLoading(false)
    }

    setIsCountrySuggestionSelected(false)
    setCountry(search)
  }

  const handleSelectCountrySuggestion = (name: string, countryCode: string) => {
    setIsCountrySuggestionSelected(true)
    setCountry(name)
    setSelectedCountryCode(countryCode)
  }

  const debouncedCountrySearch = useDebounce(country, 500)

  useEffect(() => {
    if (debouncedCountrySearch === '' || isCountrySuggestionSelected) return
    fetchCountryPredictions(debouncedCountrySearch)
  }, [debouncedCountrySearch])

  const fetchCountryPredictions = async (search: string) => {

    const username = process.env.NEXT_PUBLIC_GEONAMES_USERNAME
    try {
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${search}&maxRows=10&featureClass=A&featureCode=PCLI&username=${username}`)
      const data = await response.json()
      const suggestions = data.geonames

      setCountrySearchSuggestions(suggestions
        .map((item: any) => {
          return {
            name: item.name,
            countryCode: item.countryCode
          }
        })
      )

      setIsCountrySuggestionsLoading(false)
    } catch (error) {
      console.error('Error fetching country suggestions:', error);
      setIsCountrySuggestionsLoading(false)
    }
  }

  const [city, setCity] = useState<string>('')
  const [citySearchSuggestions, setCitySearchSuggestions] = useState<any[]>([])
  const [isCitySuggestionSelected, setIsCitySuggestionSelected] = useState<boolean>(false)
  const [isCitySuggestionsLoading, setIsCitySuggestionsLoading] = useState<boolean>(false)

  const handleCityChange = (search: string) => {
    setCitySearchSuggestions([])
    if (search !== '') {
      setIsCitySuggestionsLoading(true)
    } else {
      setIsCitySuggestionsLoading(false)
    }

    setIsCitySuggestionSelected(false)
    setCity(search)
  }

  const handleSelectCitySuggestion = (suggestion: string) => {
    setIsCitySuggestionSelected(true)
    setCity(suggestion)
  }

  const debouncedCitySearch = useDebounce(city, 500)

  useEffect(() => {
    if (debouncedCitySearch === '' || isCitySuggestionSelected) return
    fetchCityPredictions(debouncedCitySearch)
  }, [debouncedCitySearch])

  const fetchCityPredictions = async (search: string) => {

    console.log('Fetching city suggestions:', search);
    const username = process.env.NEXT_PUBLIC_GEONAMES_USERNAME
    try {
      setIsCitySuggestionsLoading(true)
      let response;
      if (selectedCountryCode == null) {
        response = await fetch(`http://api.geonames.org/searchJSON?q=${search}&maxRows=10&featureClass=P&username=${username}`)
      } else {
        response = await fetch(`http://api.geonames.org/searchJSON?q=${search}&country=${selectedCountryCode}&maxRows=10&featureClass=P&username=${username}`)

      }
      const data = await response.json()
      console.log('City suggestions:', data);
      const suggestions = data.geonames

      setCitySearchSuggestions(suggestions
        .map((item: any) => {
          return {
            name: item.name,
            countryCode: item.countryCode
          }
        })
      )

    } catch (error) {
      console.error('Error fetching country suggestions:', error);
      setIsCountrySuggestionsLoading(false)
    } finally {
      setIsCitySuggestionsLoading(false)
    }
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
    } else if (country == null) {
      toast.error('Select your city')
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
            country: country,
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
            <p className='text-left w-full lg:w-min font-semibold'>Country</p>
            <div className="w-full relative flex gap-4 lg:w-52">
              <Command className='border border-input !border-b-0'>
                <CommandInput value={country} onValueChange={handleCountryChange} placeholder="Enter country..." className="h-9 " />
                <CommandList className='absolute top-9 z-50 w-full '>

                  {!isCountrySuggestionSelected && <CommandGroup>
                    {
                      countrySearchSuggestions.map((suggestion: any) => (
                        <CommandItem
                          key={suggestion.name}
                          value={suggestion.name}
                          onSelect={() => {
                            handleSelectCountrySuggestion(suggestion.name, suggestion.countryCode)
                          }}
                          className='bg-white border border-input'
                        >
                          {suggestion.name}
                        </CommandItem>
                      ))
                    }
                  </CommandGroup>}
                </CommandList>
              </Command>

              {isCountrySuggestionsLoading &&
                <div className="w-full flex flex-col gap-3 mt-3 absolute z-50 top-9 bg-white ">
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                </div>
              }

            </div>

          </div>
          <div className='flex flex-col gap-4 lg:flex-row justify-between items-center'>
            <p className='text-left w-full lg:w-min font-semibold city-row'>City</p>
            <div className="w-full relative flex gap-4 lg:w-52">
              <Command className='border border-input !border-b-0'>
                <CommandInput value={city} onValueChange={handleCityChange} placeholder="Enter city..." className="h-9 " />
                <CommandList className='absolute top-9 z-50 w-full '>
                  {!isCitySuggestionSelected &&
                    <CommandGroup>
                      {
                        citySearchSuggestions.map((suggestion: any) => (
                          <CommandItem
                            key={suggestion.name}
                            value={suggestion.name}
                            onSelect={() => {
                              handleSelectCitySuggestion(suggestion.name)
                            }}
                            className='bg-white border border-input'
                          >
                            {suggestion.name}
                          </CommandItem>
                        ))
                      }
                    </CommandGroup>
                  }
                </CommandList>
              </Command>

              {isCitySuggestionsLoading &&
                <div className="w-full flex flex-col gap-3 mt-3 absolute z-50 top-9 bg-white ">
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                </div>
              }

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
                      key={index}
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
