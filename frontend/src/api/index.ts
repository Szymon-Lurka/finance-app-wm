import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    validateStatus: (status) => status >= 200 && status < 300
})

// TODO: Set HTTP header with token after auth
// TODO: Refresh token if response is unauthorized

export {
    axiosInstance
}
