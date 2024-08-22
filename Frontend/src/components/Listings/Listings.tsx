import React, { use } from 'react'
import ListingCard from '../Cards/ListingCard'

const Listings = ({ address, listings }: any) => {

    console.log("Listingssssssss", listings)

    const [fetchedListings, setFetchedListings] = React.useState(listings)

    React.useEffect(() => {
        setFetchedListings(listings)
    }, [listings])
    return (
        <div className='font-montserrat'>
            {listings?.length > 0 && listings.map((listing: any) => {
                return (
                    <ListingCard
                        userName={listing.user.fullName}
                        userAvatar={listing.user.avatar}
                        location={listing.location}
                        rent={listing.rent}
                        lookingFor={listing.lookingFor}
                    />
                )
            })}
        </div>
    )
}

export default Listings