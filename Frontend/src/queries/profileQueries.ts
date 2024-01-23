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
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
        }
    })
}