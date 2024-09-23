import ListingSearchAreaLayout from '@/components/Layouts/ListingSearchAreaLayout'
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout'
import Listings from '@/components/Listings/Listings'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

const Page = ({ data }: any) => {

    const router = useRouter()
    const cityName = router.query

    return (
        <SharedHeaderLayout>
            <ListingSearchAreaLayout>
                <Listings address={cityName} listings={data.data.listings} />
            </ListingSearchAreaLayout>
        </SharedHeaderLayout>
    )
}

export default Page

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const { cityName } = context.query;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listings/allListings?searchTerm=${cityName}`,
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