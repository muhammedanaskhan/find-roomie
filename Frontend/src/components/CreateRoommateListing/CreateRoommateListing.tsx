import React, { useState } from 'react'
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

import ac from '@/assets/images/ac.svg'
import fridge from '@/assets/images/fridge.svg'
import tv from '@/assets/images/tv.svg'
import washingMachine from '@/assets/images/washing-machine.svg'
import parking from '@/assets/images/parking.svg'
import wifi from '@/assets/images/wifi.svg'
import cook from '@/assets/images/cook.svg'
import kitchen from '@/assets/images/kitchen.svg'
import Image from 'next/image'
import gameConsole from '@/assets/images/game-console.svg'
import { Button } from '../ui/button'


const CreateRoommateListing = () => {

    const [location, setLocation] = useState<string>('')
    const [lookingFor, setLookingFor] = useState<string>('Male')
    const [occupancy, setOccupancy] = useState<string>('single')
    const [rent, setRent] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [isContactNumberPublic, setIsContactNumberPublic] = useState<string>('yes')

    const amenities = [
        { name: 'AC', image: ac, value: 'ac' },
        { name: 'Fridge', image: fridge, value: 'fridge' },
        { name: 'TV', image: tv, value: 'tv' },
        { name: 'Washing Machine', image: washingMachine, value: 'washingMachine' },
        { name: 'Parking', image: parking, value: 'parking' },
        { name: 'Wifi', image: wifi, value: 'wifi' },
        { name: 'Cook', image: cook, value: 'cook' },
        { name: 'Kitchen', image: kitchen, value: 'kitchen' },
        { name: 'Game Console', image: gameConsole, value: 'gameConsole' }
    ]


    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value)
    }

    const handleLookingForChange = (value: string) => {
        setLookingFor(value)
    }

    const handleOccupancyChange = (value: string) => {
        setOccupancy(value)
    }

    const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRent(e.target.value)
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

    const handleCreateListing = () => {
        if (location === '' || rent === '' || description === '') {
            toast.error('Please fill all the fields')
            return
        }

    }

    return (
        <div className='sm:w-3/4 lg:w-1/2'>

            <Toaster />
            <Card className="mt-8 md:mt-0 p-6 sm:p-10 lg:p-12 mb-4 ">
                <p className='text-2xl sm:text-4xl font-bold mb-6 h-16 border-b-2'>Add details for your place.</p>
                <div className='flex flex-col gap-6 '>
                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Location</p>
                        <div className='w-full flex gap-4 lg:w-52'>
                            <Input placeholder="New Delhi" value={location} onChange={handleLocationChange} />
                        </div>
                    </div>

                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Looking for</p>
                        <div className='w-full flex gap-4 lg:w-52'>
                            <RadioGroup className='!flex flex-row flex-wrap' defaultValue={lookingFor} onValueChange={handleLookingForChange}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={'male'} id={'male'} />
                                    <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`Female`} id={`Female`} />
                                    <Label htmlFor="Female">female</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`any`} id={`any`} />
                                    <Label htmlFor="any">Any</Label>
                                </div>
                            </RadioGroup>

                        </div>
                    </div>

                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Occupancy</p>
                        <div className='w-full flex gap-4 lg:w-52'>
                            <RadioGroup className='!flex flex-row flex-wrap' defaultValue={occupancy} onValueChange={handleOccupancyChange}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={'single'} id={'single'} />
                                    <Label htmlFor="single">Single</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`shared`} id={`shared`} />
                                    <Label htmlFor="shared">Shared</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={`any`} id={`any`} />
                                    <Label htmlFor="any">Any</Label>
                                </div>
                            </RadioGroup>

                        </div>
                    </div>

                    <div className='flex gap-4 flex-col lg:flex-row lg:gap-0 justify-between items-center'>
                        <p className=' w-full lg:w-fit text-left font-semibold mb-0'>Rent</p>
                        <div className='w-full flex gap-4 lg:w-52'>
                            <Input placeholder="$" value={rent} onChange={handleRentChange} />
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

            </Card>
        </div>
    )
}

export default CreateRoommateListing