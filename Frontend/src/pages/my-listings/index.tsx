'use client'
import ListingSearchAreaLayout from '@/components/Layouts/ListingSearchAreaLayout'
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout'
import ListingsWithDistance from '@/components/Listings/ListingsWithDistance'
import MyListingsCards from '@/components/MyListingsCards/MyListingsCards'
import ListingsCardsSkeletons from '@/components/Skeletons/ListingsCardsSkeletons'
import { useGetMyListingasQuery } from '@/queries/profileQueries'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const MyListings = () => {

    const router = useRouter()
    const { data, isError, isPending } = useGetMyListingasQuery()

    console.log("Data", data)
    return (
        <SharedHeaderLayout>
            <div className="mt-[96px]">
                {data && !isPending ?
                    <MyListingsCards listings={data?.data.listings} />
                    :
                    <>
                        <ListingsCardsSkeletons />
                    </>
                }
            </div>
        </SharedHeaderLayout>
    )
}

export default MyListings
