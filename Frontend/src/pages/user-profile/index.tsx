import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react'

const index: React.FunctionComponent = () => {

  return (
    <ProtectedRoute>
      <div>index</div>
    </ProtectedRoute>

  )
}

export default index  