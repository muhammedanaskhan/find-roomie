import React, { use } from 'react'
import ListingCard from '../Cards/ListingCard'
import Link from 'next/link'

const Listings = ({ address, listings }: any) => {

    const [fetchedListings, setFetchedListings] = React.useState(listings)

    React.useEffect(() => {
        setFetchedListings(listings)
    }, [listings])

    return (
        <div className='font-montserrat mt-6 flex flex-wrap gap-6 justify-between items-center'>
            {listings?.length > 0 && listings.map((listing: any) => {
                return (
                    <Link href={`/listing/${listing._id}`} key={listing._id} className='flex-grow-1 w-full md:w-fit'>
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

export default Listings