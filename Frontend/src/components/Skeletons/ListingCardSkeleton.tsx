import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ListingCardSkeleton = () => {
    return (
        <div className='group listingCard rounded-[16px] border max-w-[482px]  border-gray-200 px-5 py-3 hover:scale-[1.025] transition-all duration-300 ease-in-out  overflow-hidden relative'>
            <div className="flex gap-[24px] justify-center items-center transition-all duration-300 ease-in-out ">
                <Skeleton className='rounded-full w-[124px] h-[124px] flex-shrink-0' />
                <div className="flex flex-col gap-4">
                    <header className="flex flex-col gap-1">
                        <Skeleton className="w-[230px] h-[27px]"></Skeleton>
                        <Skeleton className="w-[280px] h-[18px]"></Skeleton>
                    </header>
                    <main className="flex gap-12">
                        <div className="flex flex-col gap-1">
                            <Skeleton className="w-[71px] h-[18px]"></Skeleton>
                            <Skeleton className="w-[35px] h-[18px]"></Skeleton>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Skeleton className="w-[44px] h-[18px]"></Skeleton>
                            <Skeleton className="w-[54px] h-[18px]"></Skeleton>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ListingCardSkeleton