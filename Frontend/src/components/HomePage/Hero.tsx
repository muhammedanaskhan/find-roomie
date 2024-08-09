import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Input } from "@/components/ui/input"
import { Button } from '../ui/button'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from 'next/link'

import toast, { Toaster } from 'react-hot-toast';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import { useDebounce } from '@/hooks/useDebounce'
import { Loader } from '@googlemaps/js-api-loader';
import { Skeleton } from '../ui/skeleton'

function Hero() {

  const googleMapsAPIKey = process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY as string

  const notify = () => toast.success('Successfully toasted!')

  const [location, setLocation] = useState<string>('')
  const [locationSearchSuggestions, setLocationSearchSuggestions] = useState<string[]>([])
  const [isSuggestionSelected, setIsSuggestionSelected] = useState<boolean>(false)
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState<boolean>(false)

  const debouncedLocationSearch = useDebounce(location)

  useEffect(() => {
    if (debouncedLocationSearch === '' || isSuggestionSelected) return
    fetchPredictions(debouncedLocationSearch)
  }, [debouncedLocationSearch])

  const fetchPredictions = async (location: string) => {

    const loader = new Loader({
      apiKey: googleMapsAPIKey, // Replace with your actual API key
      libraries: ['places'],
    });

    loader.importLibrary('maps').then(() => {
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: location }, (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        const fetchedSuggestions = predictions?.map((prediction) => prediction.description) || []
        setLocationSearchSuggestions(fetchedSuggestions)
        setIsSuggestionsLoading(false)
      });
    });
  }


  const handleSelectSuggestion = (suggestion: string) => {
    setIsSuggestionSelected(true)
    setLocation(suggestion)
  }

  const handleLocationChange = (search: string) => {
    setLocationSearchSuggestions([])
    if (search !== '') {
      setIsSuggestionsLoading(true)
    } else {
      setIsSuggestionsLoading(false)
    }

    setIsSuggestionSelected(false)
    setLocation(search)
  }

  return (
    <div className='w-10/12 lg:w-5/6 max-w-6xl gap-12 flex flex-row justify-between items-center h-96'>
      <div className='flex flex-col w-96 align-left justify-left text-left gap-8'>
        <div className='flex flex-col gap-2 sm:gap-6 '>
          <p className='text-4xl font-extrabold text-start sm:text-5xl'>Find A <span className='text-primaryBlue'>Perfect Roommate</span>: Your Ideal Match Awaits!</p>
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
            className="text-base text-start md:text-xl font-josefin-sans w-full text-neutral-700"
          />
        </div>
        <div className='flex flex-col gap-4'>
          <div className="flex flex-col md:flex-row w-full gap-4  items-center space-x-2 relative">
            <div className='w-full relative flex gap-4 lg:w-72'>
              {/* <Image src={locationPin} alt='location' className='absolute h-4 w-4 top-0 bottom-0 m-auto left-2' /> */}

              {/* <Input className='pl-7' placeholder="New Delhi" value={location} onChange={handleLocationChange} /> */}

              <Command className='border border-input !border-b-0'>
                <CommandInput value={location} onValueChange={handleLocationChange} placeholder="Search location..." className="h-9 " />
                <CommandList className='absolute top-9 z-50 w-full '>

                  {!isSuggestionSelected && <CommandGroup>
                    {locationSearchSuggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => {
                          handleSelectSuggestion(suggestion)
                        }}
                        className='bg-white border border-input'
                      >
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>}
                </CommandList>
              </Command>

              {isSuggestionsLoading &&
                <div className="w-full flex flex-col gap-3 mt-3 absolute z-50 top-9 bg-white ">
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                  <Skeleton className="h-[33.6px] w-full" />
                </div>
              }



            </div>
            <Button className='w-full md:w-10 px-12 hover:bg-primaryBlue hover:scale-105 bg-primaryBlue shadow-xl shadow-blueSpreadedShadow' type="submit">Search</Button>


          </div>
          <p className='text-slate-500'>
            <span className='font-bold'>Top cities: </span>
            <Link href='/city/Bengaluru' className='hover:underline cursor-pointer'>Bengaluru, </Link>
            <Link href='/city/Heydrabad' className='hover:underline cursor-pointer'>Heydrabad, </Link>
            <Link href='/city/Mumbai' className='hover:underline cursor-pointer'>Mumbai, </Link>
            <Link href='/city/Pune' className='hover:underline cursor-pointer'>Pune.</Link>
          </p>
        </div>

      </div>
      <div className='hidden lg:flex h-full w-2/4 relative'>
        <Image layout='fill' objectFit='contain' src='/games-time.svg' alt='vector' />
      </div>

    </div>
  )
}

export default Hero