import React, { useEffect } from 'react';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

//this hook will 
// take current acces token expiry from localStorage

const useCheckAccessTokenExpiryAndUpdate = () => {
    console.log('Checking access token expiry 1 ...');
    useEffect(() => {

        console.log('Checking access token expiry...');
        const refreshAccessToken = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/refresh`, { withCredentials: true });
                const newAccessToken = response.data.data;

                const decodedToken = jwtDecode<{ exp: number }>(newAccessToken);

                const newAccessTokenExpiry = decodedToken.exp;

                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('accessTokenExpiryTime', newAccessTokenExpiry.toString());

            } catch (error) {
                console.error('Error refreshing access token:', error);
                // Handle error (e.g., redirect to login page)
            }
        };

        const accessTokenExpiryInString = localStorage.getItem('accessTokenExpiryTime');

        if (accessTokenExpiryInString) {
            const expiryTimestamp = new Date(accessTokenExpiryInString).getTime();
            const currentTime = Date.now();

            if (expiryTimestamp <= currentTime) {
                console.log('Access token has expired');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('accessTokenExpiry');
                refreshAccessToken();
            }
        }
    }, []);

    return null;
};

export default useCheckAccessTokenExpiryAndUpdate;
