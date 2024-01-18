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

export const userRegisterUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<{ message: string }, Error, UserData>({
        mutationKey: ['register-user'],
        mutationFn: async (userData: { fullName: string, userName: string, email: string, password: string }) => {
            const response = await axios.post<{ message: string }>(`${process.env.NEXT_PUBLIC_BASE_URL}/users/register`, userData)
            console.log("response", response)
            return response.data
        }
    })
}