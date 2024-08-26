import React from 'react'
import ListingCardSkeleton from './ListingCardSkeleton'

const ListingsCardsSkeletons = () => {
    return (
        <div className='font-montserrat mt-[60px] max-w-[1100px] flex flex-wrap gap-14 justify-center left-0 right-0 m-auto pt-12 px-8'>
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
            <ListingCardSkeleton />
        </div>
    )
}

export default ListingsCardsSkeletons