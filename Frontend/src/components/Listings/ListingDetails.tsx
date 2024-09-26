import React, { useRef } from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import locationIcon from '@/assets/images/location-pin.svg'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { amenities } from '@/lib/constants'

const ListingDetails = ({ listingDetails }: any) => {

    const avatar = listingDetails.user.avatar
    const userName = listingDetails.user.fullName
    const lookingFor = listingDetails.lookingFor
    const currencySymbol = listingDetails.currencySymbol
    const rent = listingDetails.rent
    const location = listingDetails.location
    const gender = listingDetails.user.gender
    const email = listingDetails.user.email
    const userPreferences = listingDetails.user.preferences
    const occupancy = listingDetails.occupancy
    const fetchedAmenities = listingDetails.amenities
    const photos = listingDetails.roomPhotos
    const description = listingDetails.description


    const mappedAmenities = fetchedAmenities.map((fetchedAmenity: string) => {
        const matchedAmenity = amenities.find(
            (amenity) => amenity.value === fetchedAmenity
        );

        if (matchedAmenity) {
            return {
                ...matchedAmenity,
                image: matchedAmenity.image, // Add the image field
            };
        }

        return null;
    }).filter(Boolean);

    const swiperRefLocal = useRef<any>()

    const handleMouseSwiperEnter = () => {
        swiperRefLocal.current.swiper.autoplay.stop()
    }

    const handleMouseSwiperLeave = () => {
        swiperRefLocal.current.swiper.autoplay.start()
    }

    return (
        <div className='sm:w-3/4 px-4 pt-8 font-montserrat'>
            <Card className="mt-8 md:mt-0 pb-4 mb-4 text-black flex flex-col gap-10 md:gap-8">

                <div className="group cursor-pointer px-5 py-3 transition-all duration-300 ease-in-out overflow-hidden relative border-b-[0.5px]">
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
                    <div className=" bottom-0 left-5 right-0 md:h-0 md:group-hover:h-[60px] transition-all duration-300  ease-in-out transform md:translate-y-full group-hover:translate-y-0 md:opacity-0 md:group-hover:opacity-100">
                        <div className="flex justify-start flex-col md:flex-row gap-3 mt-3 md:mt-0 md:gap-8 text-[14px]">
                            <div className=" flex gap-8">
                                <span className=" text-gray-500">
                                    {`${gender}`}
                                </span>
                                <span className=" text-gray-500">
                                    {`Looking for: ${lookingFor}`}
                                </span>
                            </div>

                            <a className=" text-gray-500" href={`mailto:${email}`}>
                                {`Mail: ${email}`}
                            </a>
                        </div>
                        <div className="flex flex-wrap w-full justify-center gap-4 mt-3">
                            {
                                userPreferences.map((preference: any, index: number) => {
                                    return (
                                        <div className="flex justify-start" key={index}>
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
                <div className=" px-5  flex flex-col gap-8">
                    <div className="flex flex-col xl:flex-row justify-between gap-10 xlgap-5">
                        <div className="location flex-grow flex flex-col gap-2">
                            <span className="text-[20px] font-medium">Location </span>
                            <span className="flex gap-1 justify-start text-[16px] items-center">
                                <Image src={locationIcon} alt='location' width={16} height={16} />
                                {location}
                            </span>
                        </div>

                        <div className="basic-info flex flex-col gap-2">
                            <span className="text-[20px] w-full text-left font-medium">Basic Information</span>
                            <div className=" flex w-full justify-start text-[14px] gap-4 text-gray-500">
                                <div className="flex gap-2 text-[16px]">
                                    <span className="">Approx Rent: </span>
                                    <span className="text-[16px] text-right font-medium">{`${currencySymbol}${rent}`}</span>
                                </div>
                                <div className="h-[25px] w-[1px] bg-gray-400"></div>
                                <div className="flex gap-2 text-[16px]">
                                    <span className="">Occupancy: </span>
                                    <span className="text-[16px] font-medium">{occupancy}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <section className=" photos-section px-5 w-full flex flex-col gap-2 items-center justify-center">
                    <span className="text-[20px] w-full text-left font-medium">Photos </span>
                    <div
                        onMouseEnter={handleMouseSwiperEnter} onMouseLeave={handleMouseSwiperLeave}
                        className=" px-5 hidden lg:flex lg:w-[700px]">
                        <Swiper
                            ref={swiperRefLocal}
                            modules={[Navigation, Autoplay]}
                            spaceBetween={50}
                            slidesPerView={1}
                            navigation
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                        >
                            {
                                photos.map((photo: any, index: any) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <Image src={photo} alt='room' width={400} height={400} className='left-0 right-0 m-auto select-none' />
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                    </div>
                    <div className=" px-5 flex lg:hidden w-[300px]">
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={50}
                            slidesPerView={1}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                        >
                            {
                                photos.map((photo: any, index: number) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <Image src={photo} alt='room' width={400} height={400} className='left-0 right-0 m-auto select-none' />
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                    </div>
                </section>

                <div className="amenites flex-grow flex flex-col px-5 gap-2">
                    <span className="text-[20px] font-medium">Amenities </span>
                    <div className=' flex gap-4 w-full'>
                        <div className='flex gap-8 flex-wrap justify-center items-center w-full'>
                            {
                                mappedAmenities.map((amenity: any, index: any) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`flex flex-col items-center hover:scale-[1.025] transition duration-150 cursor-pointer`}>
                                            <div className={`border border-input rounded-full p-4`}>
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

                <div className="Description flex-grow flex flex-col px-5 gap-2">
                    <span className="text-[20px] font-medium">Description </span>
                    <div className=' flex gap-4 w-full bg-[#F3F4F8] rounded-xl p-4'>
                        {description}
                    </div>
                </div>

            </Card>
        </div>
    )
}

export default ListingDetails
