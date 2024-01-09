import {axiosInstance} from "../index";

const authService = {
    login(payload: any): any {
        return axiosInstance.post('/api/v1/auth/login', {
            username: payload.username,
            password: payload.password,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName
        })
    }
}
export {authService}