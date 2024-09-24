import React, { use } from 'react'
import ListingCardWithDistance from '../Cards/ListingCardWithDistance'
import Link from 'next/link'

const ListingsWithDistance = ({ address, listings }: any) => {

    const [fetchedListings, setFetchedListings] = React.useState(listings)

    React.useEffect(() => {
        setFetchedListings(listings)
    }, [listings])
    return (
        <div className='font-montserrat mt-6 flex flex-wrap gap-6 justify-between items-center'>
            {listings?.length > 0 && listings.map((listing: any, index: any) => {
                return (
                    <Link href={`/listing/${listing._id}`} key={index} className='flex-grow-1 w-full md:w-fit'>
                        <ListingCardWithDistance
                            key={listing._id}
                            userName={listing.user.fullName}
                            userAvatar={listing.user.avatar}
                            location={listing.location}
                            rent={listing.rent}
                            currencySymbol={listing.currencySymbol}
                            distanceInKm={listing.distanceInKm}
                            lookingFor={listing.lookingFor}
                        />
                    </Link>

                )
            })}
        </div>
    )
}

export default ListingsWithDistance