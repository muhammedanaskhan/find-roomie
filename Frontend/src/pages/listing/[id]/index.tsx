import Header from '@/components/Header';
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout';
import ListingDetails from '@/components/Listings/ListingDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react'

interface Params extends ParsedUrlQuery {
    id: string;
}

const index: React.FunctionComponent = ({ data }: any) => {

    return (
        <SharedHeaderLayout>
            <section className='h-full pt-16 flex justify-center items-center top-2/4'>
                <ListingDetails listingDetails={data.data.listing} />
            </section>
        </SharedHeaderLayout>
    )
}

export default index

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const { id } = context.params as Params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listings/listingDetails?listingId=${id}`,
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