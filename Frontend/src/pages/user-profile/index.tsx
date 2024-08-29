import Header from '@/components/Header';
import SharedHeaderLayout from '@/components/Layouts/SharedHeaderLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile/UserProfile';
import { Card } from '@/components/ui/card';
import React from 'react'

const index: React.FunctionComponent = () => {

  return (
    <div>
      <SharedHeaderLayout>
        <ProtectedRoute>
          <section className='h-full pt-16 flex justify-center items-center top-2/4'>
            <UserProfile />
          </section>

        </ProtectedRoute>
      </SharedHeaderLayout>

    </div>
  )
}

export default index  