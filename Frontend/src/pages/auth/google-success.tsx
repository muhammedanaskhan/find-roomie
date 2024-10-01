import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/Redux/authSlice';

const GoogleSuccess = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/auth/user', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userDetails = await response.json();

                dispatch(setAuth({
                    userName: userDetails.fullName,
                    email: userDetails.email,
                    accessToken: document.cookie.split('accessToken=')[1].split(';')[0], // Get accessToken from cookie
                    isUserAuthenticated: true,
                    avatar: userDetails.avatar
                }));

                router.push('/home');
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        fetchUserData();
    }, [dispatch, router]);

    return <div>Completing login, please wait...</div>;
};

export default GoogleSuccess;