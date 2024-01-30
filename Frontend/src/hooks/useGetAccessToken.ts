import axios from "axios"

const useGetAccessToken = () => {

    const getAccessToken = async() => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/refresh`,{withCredentials: true})
        return response;
    }
    return getAccessToken
}

export default useGetAccessToken