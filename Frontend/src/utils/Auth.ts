import { useEffect, useState } from "react";

const useIsUserAuthentication = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('accessToken');
            setIsAuthenticated(accessToken !== null && accessToken !== undefined && accessToken !== '');
        }
    }, [])

    return isAuthenticated;
}

export default useIsUserAuthentication;
