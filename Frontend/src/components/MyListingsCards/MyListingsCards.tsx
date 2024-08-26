import Link from 'next/link'
import React from 'react'
import ListingCard from '../Cards/ListingCard'

const MyListingsCards = ({ listings }: any) => {
    return (
        <div className='font-montserrat mt-[60px] max-w-[1100px] flex flex-col justify-center left-0 right-0 m-auto pt-12 px-8'>
            {listings?.length > 0 && listings.map((listing: any) => {
                return (
                    <Link href={`/listing/${listing._id}`} key={listing._id}>
                        <ListingCard
                            key={listing._id}
                            userName={listing.user.fullName}
                            userAvatar={listing.user.avatar}
                            location={listing.location}
                            currencySymbol={listing.currencySymbol}
                            rent={listing.rent}
                            lookingFor={listing.lookingFor}
                        />
                    </Link>
                )
            })}
        </div>
    )
}

export default MyListingsCards