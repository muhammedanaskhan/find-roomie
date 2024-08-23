import { listingCardPropsType } from '@/types/types'
import Image from 'next/image'
import React from 'react'

const ListingCard: React.FC<listingCardPropsType> = (
    { userName, userAvatar, location, rent, lookingFor, distanceInKm }
) => {


    const distance = distanceInKm?.toFixed(1)
    return (
        <div className='group listingCard rounded-[16px] border max-w-[482px]  border-gray-200 px-5 py-3 transition-all duration-300 ease-in-out hover:shadow-lg overflow-hidden relative'>
            <div className="flex gap-[24px] justify-center items-center transition-all duration-300 ease-in-out transform group-hover:pb-5">
                <Image
                    src={userAvatar}
                    alt='user'
                    width={124}
                    height={124}
                    priority={true}
                    className='rounded-full' />
                <div className="flex flex-col gap-4">
                    <header className="flex flex-col gap-1">
                        <h1 className="text-[18px] font-medium text-gray-600">{userName}</h1>
                        <p className="text-[12px] truncate w-40 sm:w-80 md:w-40 lg:w-[280px]">{location}</p>
                    </header>
                    <main className="flex gap-12">
                        <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-gray-500">Looking For</span>
                            <h1 className="text-[14px] text-gray-600">{lookingFor}</h1>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-gray-500">Rent</span>
                            <h1 className="text-[14px] text-gray-600">{rent}</h1>
                        </div>
                    </main>
                </div>
            </div>
            <div className="absolute bottom-0 left-5 right-0 h-0 group-hover:h-[32px] transition-all duration-300  ease-in-out transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                <span className="text-[12px]">
                    <span className="font-medium">{`${distance} km`}</span>{` from your search`}
                </span>
            </div>
        </div>
    )
}

export default ListingCard