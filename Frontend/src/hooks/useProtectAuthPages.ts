import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function useProtectAuthPages() {

    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const isUserAuthenticated = localStorage.getItem('isUserAuthenticated');
        if (accessToken) {
            router.push('/');
        }else if (!accessToken && isUserAuthenticated === 'false') {
            router.push('/login/personal-details');
        }
    }, [])

    return {}
}

export default useProtectAuthPages