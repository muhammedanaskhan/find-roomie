import {
    useQuery,
    useMutation,
    useQueryClient,

} from '@tanstack/react-query'
import { userType } from '@/types/user'
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
    city: string;
    avatar: File;
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
            const formData = new FormData();
            formData.append('gender', userData.gender);
            formData.append('city', userData.city);
            formData.append('avatar', userData.avatar);
            formData.append('preferences', JSON.stringify(userData.preferences));
            
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/authenticate`, formData, {
                headers: {
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