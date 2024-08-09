import ListingSearchAreaLayout from '@/components/Layouts/ListingSearchAreaLayout'
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout'
import Listings from '@/components/Listings/Listings'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {

    const router = useRouter()
    const cityName = router.query
    return (
        <SharedHeaderLayout>
            <ListingSearchAreaLayout>
                <Listings address={cityName} />
            </ListingSearchAreaLayout>
        </SharedHeaderLayout>
    )
}

export default Page 