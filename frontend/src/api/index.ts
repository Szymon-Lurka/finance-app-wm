import axios from "axios";


console.log(import.meta.env);
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    validateStatus: (status) => status >= 200 && status < 300
})

// TODO: Set HTTP header with token after auth
// TODO: Refresh token if response is unauthorized

export {
    axiosInstance
}
