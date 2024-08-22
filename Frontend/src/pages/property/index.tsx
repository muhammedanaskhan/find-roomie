import ListingSearchAreaLayout from '@/components/Layouts/ListingSearchAreaLayout'
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout'
import Listings from '@/components/Listings/Listings'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

const Property = ({ data }: any) => {

    const router = useRouter()
    const { address, lat, lng } = router.query

    const listings = data.data.listings;

    return (
        <SharedHeaderLayout>
            <ListingSearchAreaLayout>
                <div>
                    <Listings address={address} listings={listings} />
                </div>
            </ListingSearchAreaLayout>
        </SharedHeaderLayout>
    )
}

export default Property

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const { lat, lng } = context.query;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listings/fetch?maxDistanceInMeters=${20000}&lat=${lat}&lng=${lng}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
    const data = await res.json()
    return { props: { data } }
}