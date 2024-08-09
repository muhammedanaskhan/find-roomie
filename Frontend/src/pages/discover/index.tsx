import Header from '@/components/Header'
import ListingSearchAreaLayout from '@/components/Layouts/ListingSearchAreaLayout'
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout'
import React from 'react'

const index = () => {
  return (
    <SharedHeaderLayout>
      <ListingSearchAreaLayout>
        <div>
          <h1 className='text-black'>Discover</h1>
        </div>
      </ListingSearchAreaLayout>
    </SharedHeaderLayout>
  )
}

export default index