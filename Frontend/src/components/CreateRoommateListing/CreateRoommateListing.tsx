import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '../ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import styles from '@/components/PersonalDetails/AvatarCropPopup.module.css'

import upload from '@/assets/images/upload.svg'
import cross from '@/assets/images/cross.svg'
import locationPin from '@/assets/images/location-pin.svg'
import Image from 'next/image'
import { Button } from '../ui/button'
import { useDebounce } from '@/hooks/useDebounce'

import { Loader } from '@googlemaps/js-api-loader';

import { useDropzone } from 'react-dropzone';
import NProgress from "nprogress";

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
import { set } from 'nprogress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Skeleton } from '../ui/skeleton'
import { useGetUserDataQuery } from '@/queries/profileQueries'
import { useRouter } from 'next/router'
import { FileUploader } from 'react-drag-drop-files'
import { amenities, currencySymbols } from '@/lib/constants'

const CreateRoommateListing = () => {

    const { mutateAsync: getUser } = useGetUserDataQuery();

    const googleMapsAPIKey = process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY as string

    const [email, setEmail] = useState<string>('')
    const [location, setLocation] = useState<string>('')
    const [lookingFor, setLookingFor] = useState<string>('Male')
    const [occupancy, setOccupancy] = useState<string>('Single')
    const [rent, setRent] = useState<number>(0)
    const [description, setDescription] = useState<string>('')
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [currencySymbol, setCurrencySymbol] = useState<string>('')
    const [isContactNumberPublic, setIsContactNumberPublic] = useState<string>('yes')

    const [locationSearchSuggestions, setLocationSearchSuggestions] = useState<string[]>([])
    const [isSuggestionSelected, setIsSuggestionSelected] = useState<boolean>(false)
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState<boolean>(false)



    const debouncedLocationSearch = useDebounce(location)

    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            router.push('/login');
        } else {
            const fetchUserData = async () => {
                try {
                    const result = await getUser();
                    setEmail(result.data.email);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    }, [])

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

    const handleSelectSuggestion = (suggestion: string) => {
        setIsSuggestionSelected(true)
        setLocation(suggestion)
    }

    const handleLookingForChange = (value: string) => {
        setLookingFor(value)
    }

    const handleOccupancyChange = (value: string) => {
        setOccupancy(value)
    }

    const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = (e.target.value)
        setRent(value ? parseInt(value) : 0);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    const handleSelectAmenity = (value: string) => {
        if (selectedAmenities.includes(value)) {
            setSelectedAmenities(selectedAmenities.filter(amenity => amenity !== value))
        } else {
            setSelectedAmenities([...selectedAmenities, value])
        }
    }

    const handleIsContactNumberPublicChange = (value: string) => {
        setIsContactNumberPublic(value)
    }

    const handleCreateListing = async () => {
        if (location === '' || rent === 0 || description === '') {
            toast.error('Please fill all the fields')
            return
        }

        if (files.length < 3) {
            toast.error('Please upload 3 images')
            return
        }

        console.log('Creating listing...', files)

        const data = {
            userEmail: email,
            location,
            lookingFor,
            rent,
            roomImages: files,
            occupancy,
            description,
            amenities: selectedAmenities,
            isContactNumberPublic: isContactNumberPublic === 'yes' ? true : false
        }

        const formData = new FormData();

        const encodedLocation = encodeURIComponent(location)

        const geoCodedDataResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${googleMapsAPIKey}`)
        const geoData = await geoCodedDataResponse.json()

        const city = geoData.results[0].address_components.find((component: any) => component.types.includes('locality'))?.long_name
        const fetchedCoordinates = geoData.results[0].geometry.location
        const lat = fetchedCoordinates.lat;
        const lng = fetchedCoordinates.lng;

        formData.append('userEmail', email)
        formData.append('location', location)
        formData.append('city', city)
        formData.append('geometry', JSON.stringify({ type: 'Point', coordinates: [lng, lat] }))
        formData.append('lookingFor', lookingFor)
        formData.append('currencySymbol', currencySymbol)
        formData.append('rent', rent.toString())
        formData.append('occupancy', occupancy)
        formData.append('description', description)
        formData.append('amenities', JSON.stringify(selectedAmenities))
        formData.append('isContactNumberPublic', isContactNumberPublic === 'yes' ? 'true' : 'false')

        files.forEach((file, index) => {
            formData.append('roomImages', file);
        });

        try {
            NProgress.start();
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listings/create`, {
                method: 'POST',
                body: formData,
            });

            if (res.status === 201) {
                toast.success('Listing created successfully')
                NProgress.done();
            }


        } catch (err) {
            console.error(err)
            NProgress.done();
            toast.error(`${err}`)
        }

        console.log(data)
    }

    const [files, setFiles] = useState<File[]>([]);

    const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (files.length >= 3) return;
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    }


    return (
        <div className='sm:w-3/4 lg:w-1/2 px-4'>

            <Toaster />
            <Card className="mt-8 md:mt-0 p-6 sm:p-10 lg:p-12 mb-4 ">
                <p className='text-2xl sm:text-4xl font-bold mb-6 h-16 border-b-2'>Add details for your place.</p>
                <div className='flex flex-col gap-6 '>
                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Location</p>
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
                    </div>

                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Looking for</p>
                        <div className='w-full flex gap-4 lg:w-52'>
                            <RadioGroup className='!flex flex-row flex-wrap' defaultValue={lookingFor} onValueChange={handleLookingForChange}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={'Male'} id={'Male'} />
                                    <Label htmlFor="Male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`Female`} id={`Female`} />
                                    <Label htmlFor="Female">Female</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`Any`} id={`Any`} />
                                    <Label htmlFor="Any">Any</Label>
                                </div>
                            </RadioGroup>

                        </div>
                    </div>

                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Occupancy</p>
                        <div className='w-full flex gap-4 lg:w-52'>
                            <RadioGroup className='!flex flex-row flex-wrap' defaultValue={occupancy} onValueChange={handleOccupancyChange}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={'Single'} id={'Single'} />
                                    <Label htmlFor="Single">Single</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`Shared`} id={`Shared`} />
                                    <Label htmlFor="Shared">Shared</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`Any`} id={`Any`} />
                                    <Label htmlFor="Any">Any</Label>
                                </div>
                            </RadioGroup>

                        </div>
                    </div>

                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Rent</p>
                        <div className="flex gap-[14px]">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className='w-[90px]' variant="outline">{currencySymbol === '' ? "Currency" : currencySymbol}</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[90px] !ml-10 !left-0 max-h-52 overflow-auto">
                                    <DropdownMenuRadioGroup value={currencySymbol} onValueChange={setCurrencySymbol}>
                                        {
                                            currencySymbols.map((currency, index) => {
                                                return (
                                                    <DropdownMenuRadioItem key={index} value={currency.symbol}>{currency.symbol}</DropdownMenuRadioItem>
                                                )
                                            })
                                        }

                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className='w-full flex gap-4 lg:w-[176px]]'>
                                <Input type='number' placeholder="Approx rent" value={rent === 0 ? '' : rent} onChange={handleRentChange} />
                            </div>
                        </div>
                    </div>


                    <div className='flex gap-4 flex-col lg:flex-col lg:gap-3 justify-between items-left'>
                        <p className='w-full lg:w-fit text-left font-semibold mb-0'>Upload 3 images of your place</p>
                        <div className='group inputDiv w-full flex gap-4 lg:w-full relative border border-input border-dashed rounded-md'>
                            <input
                                id='fileInput'
                                className='hidden absolute'
                                onChange={handleSelectImages}
                                accept="image/png, image/jpg, image/webp, image/jpeg"
                                multiple={true}
                                type="file"
                            />
                            <label htmlFor='fileInput' className="w-full h-full grid place-content-center p-3">
                                <div className=" group-hover:scale-[1.05] transition duration-150 bg-gray-100 upload-fonts w-full rounded-lg text-gray-600 flex flex-col items-center py-4 px-3 gap-0 mt-1 cursor-pointer md:text-xs md:gap-2 md:px-8 md:py-5">
                                    <Image src={upload} alt="upload-icon" className="w-5" />
                                    <p>Click or Drag Images To Upload</p>
                                    <p>(JPG, PNG, JPEG )</p>
                                </div>
                            </label>
                        </div>

                        <div className="flex w-full justify-center items-center gap-4">
                            {files.map((file) => {
                                return (
                                    <div key={file.name} className="flex flex-col items-center gap-2 relative">
                                        <div
                                            onClick={() => setFiles(files.filter(f => f !== file))}
                                            className="absolute top-[-4px] hover:scale-[1.05] transition duration-150 flex justify-center cursor-pointer items-center right-[-4px] bg-white border border-black rounded-full p-[2px]">
                                            <Image src={cross} alt="cross" className=" w-3 h-3 " onClick={() => setFiles(files.filter(f => f !== file))} />
                                        </div>
                                        <Image src={URL.createObjectURL(file)} width={24} height={24} alt={file.name} className='h-20 w-20 rounded-md' />
                                        <p className='text-[12px]'>{file.name}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>



                    <div className='flex flex-col lg:flex-col gap-2 justify-between items-left'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Facilities</p>
                        <div className=' flex gap-4 w-full'>
                            <div className='flex gap-8 flex-wrap justify-center items-center'>
                                {
                                    amenities.map((amenity, index) => {
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => { handleSelectAmenity(amenity.value) }}
                                                className={`flex flex-col items-center hover:scale-[1.025] transition duration-150 cursor-pointer ${selectedAmenities?.includes(amenity.value) ? '' : ''}`}>
                                                <div className={`border border-input rounded-full p-4 ${selectedAmenities?.includes(amenity.value) ? 'border-primaryBlue bg-primaryBlue bg-opacity-10' : ''}`}>
                                                    <Image src={amenity.image} alt={amenity.name} className='h-10 w-10' />
                                                </div>
                                                <p className='text-xs'>{amenity.name}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col lg:flex-col gap-2 justify-between items-left'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Description</p>
                        <div className=' flex gap-4 w-full'>
                            <textarea className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50' placeholder="flex your spot..." value={description} onChange={handleDescriptionChange} />
                        </div>
                    </div>

                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className='flex-1 w-full lg:w-fit text-left font-semibold mb-0'>Make phone number visible to others</p>
                        <div className=' flex gap-4'>
                            <RadioGroup className='!flex flex-row flex-wrap' defaultValue={isContactNumberPublic} onValueChange={handleIsContactNumberPublicChange}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={'yes'} id={'yes'} />
                                    <Label htmlFor="yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`no`} id={`no`} />
                                    <Label htmlFor="no">No</Label>
                                </div>

                            </RadioGroup>

                        </div>
                    </div>

                    <Button className='w-full sm:w-1/2 left-0 right-0 m-auto mt-6 bg-primaryBlue hover:bg-primaryBlue'
                        onClick={handleCreateListing}
                    >
                        Create Listing
                    </Button>






                </div>

            </Card >
        </div >
    )
}

export default CreateRoommateListing