import React, { use } from 'react'
import ListingCard from '../Cards/ListingCard'
import Link from 'next/link'

const Listings = ({ address, listings }: any) => {

    console.log("Listingssssssss", listings)

    const [fetchedListings, setFetchedListings] = React.useState(listings)

    React.useEffect(() => {
        setFetchedListings(listings)
    }, [listings])

    return (
        <div className='font-montserrat mt-6'>
            {listings?.length > 0 && listings.map((listing: any) => {
                return (
                    <Link href={`/listing/${listing._id}`}>
                        <ListingCard
                            key={listing._id}
                            userName={listing.user.fullName}
                            userAvatar={listing.user.avatar}
                            location={listing.location}
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