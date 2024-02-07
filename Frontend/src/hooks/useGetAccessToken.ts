import axios from "axios"

const useGetAccessToken = () => {

    const getAccessToken = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/refresh`, { withCredentials: true })
            console.log("new access Token from refresh token", response.data.data)
            return response;
        } catch (err) {
            console.log("err refreshing access token", err)
        }
    }
    return getAccessToken
}

export default useGetAccessToken