import ListingSearchAreaLayout from '@/components/Layouts/ListingSearchAreaLayout'
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout'
import Listings from '@/components/Listings/Listings'
import { useRouter } from 'next/router'
import React from 'react'

const Property = () => {

    const router = useRouter()
    const { address } = router.query
    return (
        <SharedHeaderLayout>
            <ListingSearchAreaLayout>
                <div>
                    <h1 className='text-black'>{address}</h1>
                    <Listings address={address} />
                </div>
            </ListingSearchAreaLayout>
        </SharedHeaderLayout>
    )
}

export default Property