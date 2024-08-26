import {
    useQuery,
    useMutation,
    useQueryClient,

} from '@tanstack/react-query'
import { userType } from '@/types/types'
import axios from 'axios'

interface UserData {
    fullName: string;
    userName: string;
    email: string;
    password: string;
}


interface LoginUserData {
    userName?: string;
    email?: string;
    password: string;
}

interface authenticateUserData {
    gender: string;
    country: string;
    city: string;
    avatar: File | null;
    preferences: string[];
}

interface updateUserData {
    fullName: string;
    gender: string;
    city: string;
    preferences: string[];
}

axios.defaults.withCredentials = true;

export const useRegisterUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['register-user'],
        mutationFn: async (userData: { fullName: string, userName: string, email: string, password: string }) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/register`, userData)
            return response.data
        }
    })
}

export const useLoginUserQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['login-user'],
        mutationFn: async (userLoginData: LoginUserData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/login`, userLoginData)
            return response.data
        },
        onSuccess: (data) => {
            localStorage.setItem('TOKEN', data.data.accessToken);
        }
    })
}

export const useAuthenticateUserQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['authenticate-user'],
        mutationFn: async (userData: authenticateUserData) => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('Access token not found');
            }

            const formData = new FormData();
            formData.append('gender', userData.gender);
            formData.append('country', userData.country);
            formData.append('city', userData.city);
            if (userData.avatar !== null) {
                formData.append('avatar', userData.avatar);
            }
            formData.append('preferences', JSON.stringify(userData.preferences));

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/authenticate`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data
        },
        // onSuccess: (data) => {
        //     localStorage.setItem('TOKEN', data.data.accessToken);
        // }
    })
}

export const useGetUserDataQuery = () => {
    console.log('useGetUserDataQuery')
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['get-user-data'],
        mutationFn: async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-data`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            return response.data
        }
    })
}

export const useUpdateUserDataQuery = () => {
    console.log('useUpdateUserDataQuery')
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['update-user-data'],
        mutationFn: async (userData: updateUserData) => {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/users/update-user-data`, userData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            return response.data
        }
    })
}

export const useGetMyListingasQuery = () => {
    return useQuery({
        queryKey: ['get-my-listings'],
        queryFn: async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/listings/getUserListings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            return response.data
        }
    })
}
