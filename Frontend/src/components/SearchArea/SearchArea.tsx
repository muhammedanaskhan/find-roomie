import React, { useEffect, useState } from 'react'

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
import { Skeleton } from '../ui/skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { Loader } from '@googlemaps/js-api-loader'
import { GenderFilter } from '../elements/GenderFilter'
import { useRouter } from 'next/router'

const SearchArea = () => {

    const router = useRouter()
    const googleMapsAPIKey = process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY as string

    const [location, setLocation] = useState<string>('')
    const [locationSearchSuggestions, setLocationSearchSuggestions] = useState<string[]>([])
    const [isSuggestionSelected, setIsSuggestionSelected] = useState<boolean>(false)
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState<boolean>(false)

    console.log(location)

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


    const handleSelectSuggestion = async (suggestion: string) => {
        // location sleected from dropdown
        setIsSuggestionSelected(true)
        setLocation(suggestion)

        //fetch coordinates for selected location
        const encodedLocation = encodeURIComponent(suggestion)
        const geoCodedDataResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${googleMapsAPIKey}`)
        const geoData = await geoCodedDataResponse.json()
        const city = geoData.results[0].address_components.find((component: any) => component.types.includes('locality'))?.long_name
        const fetchedCoordinates = geoData.results[0].geometry.location
        const lat = fetchedCoordinates.lat;
        const lng = fetchedCoordinates.lng;

        router.push(`/property?address=${encodeURIComponent(suggestion)}&lat=${lat}&lng=${lng}&gender=all`)
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
        <div className='w-full flex gap-4 text-black border-b py-6'>
            <div className="relative w-[300px]">
                <Command className='border border-input !border-b-0'>
                    <CommandInput value={location} onValueChange={handleLocationChange} placeholder="Search places..." className="h-9 " />
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
            <GenderFilter />
        </div>
    )
}

export default SearchArea