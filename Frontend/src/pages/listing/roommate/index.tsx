import CreateRoommateListing from '@/components/CreateRoommateListing/CreateRoommateListing';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile/UserProfile';
import { Card } from '@/components/ui/card';
import React from 'react'

const index: React.FunctionComponent = () => {

    return (
        <div>
            <Header />
            <ProtectedRoute>
                <section className='h-full pt-16 flex justify-center items-center top-2/4'>
                    <CreateRoommateListing />
                </section>

            </ProtectedRoute>
        </div>
    )
}

export default index  