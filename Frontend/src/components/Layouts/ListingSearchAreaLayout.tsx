import React from 'react'
import SearchArea from '../SearchArea/SearchArea'

const ListingSearchAreaLayout = ({ children }: any) => {
    return (
        <div className='mt-[60px] max-w-[1100px] flex flex-col justify-center left-0 right-0 m-auto pt-8 sm:pt-12 px-4 sm:px-8'>
            <SearchArea />
            {children}
        </div>
    )
}

export default ListingSearchAreaLayout