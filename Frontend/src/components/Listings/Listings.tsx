import React, { use } from 'react'
import ListingCard from '../Cards/ListingCard'

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
                    <ListingCard
                        key={listing._id}
                        userName={listing.user.fullName}
                        userAvatar={listing.user.avatar}
                        location={listing.location}
                        rent={listing.rent}
                        distanceInKm={listing.distanceInKm}
                        lookingFor={listing.lookingFor}
                    />
                )
            })}
        </div>
    )
}

export default Listings