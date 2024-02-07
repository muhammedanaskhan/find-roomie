import ProtectedRoute from '@/components/ProtectedRoute';
import useIsUserAuthentication from '@/utils/Auth'
import { redirect } from 'next/navigation';

import React from 'react'


const index: React.FunctionComponent = () => {

  return (
    <ProtectedRoute>
      <div>index</div>
    </ProtectedRoute>

  )
}

export default index  