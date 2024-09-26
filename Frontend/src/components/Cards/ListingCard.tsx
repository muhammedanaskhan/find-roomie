import { listingCardPropsType } from '@/types/types'
import Image from 'next/image'
import React from 'react'

const ListingCard: React.FC<listingCardPropsType> = (
    { userName, userAvatar, location, rent, lookingFor, currencySymbol }
) => {



    function truncateText(text: string, maxLength: number) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    return (
        <div className='group listingCard rounded-[16px] border w-full md:max-w-[482px]  border-gray-200 px-5 py-3 hover:scale-[1.025] transition-all duration-300 ease-in-out  overflow-hidden relative'>
            <div className="flex gap-[18px] sm:gap-[24px] justify-center items-center transition-all duration-300 ease-in-out ">
                <Image
                    src={userAvatar}
                    alt='user'
                    width={124}
                    height={124}
                    priority={true}
                    className='rounded-full w-[112px] h-[112px] sm:w-[124px] sm:h-[124px]' />
                <div className="flex flex-col gap-4">
                    <header className="flex flex-col gap-1">
                        <h1 className="text-[14px] sm:text-[18px] font-medium text-gray-600 truncate">{truncateText(userName, 18)}</h1>
                        <p className="text-[12px] truncate w-40 sm:w-80 md:w-40 lg:w-[280px]">{location}</p>
                    </header>
                    <main className="flex gap-12">
                        <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-gray-500">Looking For</span>
                            <h1 className="text-[14px] text-gray-600">{lookingFor}</h1>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-gray-500">Rent</span>
                            <h1 className="text-[14px] text-gray-600">{`${currencySymbol}${rent}`}</h1>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ListingCard