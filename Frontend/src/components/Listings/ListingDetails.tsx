import React from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import locationIcon from '@/assets/images/location-pin.svg'

const ListingDetails = ({ listingDetails }: any) => {

    const avatar = listingDetails.user.avatar
    const userName = listingDetails.user.fullName
    const lookingFor = listingDetails.lookingFor
    const rent = listingDetails.rent
    const location = listingDetails.location
    const gender = listingDetails.user.gender
    const email = listingDetails.user.email
    const userPreferences = listingDetails.user.preferences
    const occupancy = listingDetails.occupancy
    return (
        <div className='sm:w-3/4 px-4 pt-8 font-montserrat'>
            <Card className="mt-8 md:mt-0 pb-4 mb-4 text-black">

                <div className="group px-5 py-3 transition-all duration-300 ease-in-out overflow-hidden relative border-b-[0.5px]">
                    <div className="flex gap-[24px] justify-start items-center transition-all duration-300 ease-in-out transform group-hover:pb-3">
                        <Image
                            src={avatar}
                            alt='user'
                            width={56}
                            height={56}
                            priority={true}
                            className='rounded-full' />
                        <h1 className="text-[24px] font-medium text-gray-600">{userName}</h1>
                    </div>
                    <div className=" bottom-0 left-5 right-0 h-0 group-hover:h-[60px] transition-all duration-300  ease-in-out transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                        <div className="flex justify-start gap-8 text-[14px]">
                            <span className=" text-gray-500">
                                {`${gender}`}
                            </span>
                            <span className=" text-gray-500">
                                {`Looking for: ${lookingFor}`}
                            </span>
                            <span className=" text-gray-500">
                                {`Mail: ${email}`}
                            </span>
                        </div>
                        <div className="flex flex-wrap w-full justify-center gap-4 mt-3">
                            {
                                userPreferences.map((preference: any) => {
                                    return (
                                        <div className="flex justify-start ">
                                            <div className="text-[12px] text-gray-500 border rounded-full px-4 py-1">
                                                {preference}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>
                <div className=" px-5 mt-3 flex flex-col gap-4">
                    <span className="flex gap-2 justify-start items-center">
                        <Image src={locationIcon} alt='location' width={20} height={20} />
                        {location}
                    </span>
                    <div className="flex text-[14px] gap-10 text-gray-500">
                        <span className="">{`Approx Rent: ${rent}`}</span>
                        <span className="">{`Occupancy: ${occupancy}`}</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ListingDetails
// <div className="flex flex-col gap-4">
//                         <header className="flex flex-col gap-1">
//                             <h1 className="text-[18px] font-medium text-gray-600">{userName}</h1>
//                             <p className="text-[12px] truncate w-40 sm:w-80 md:w-40 lg:w-[280px]">{location}</p>
//                         </header>
//                         <main className="flex gap-12">
//                             <div className="flex flex-col gap-1">
//                                 <span className="text-[12px] text-gray-500">Looking For</span>
//                                 <h1 className="text-[14px] text-gray-600">{lookingFor}</h1>
//                             </div>
//                             <div className="flex flex-col gap-1">
//                                 <span className="text-[12px] text-gray-500">Rent</span>
//                                 <h1 className="text-[14px] text-gray-600">{rent}</h1>
//                             </div>
//                         </main>
//                     </div>