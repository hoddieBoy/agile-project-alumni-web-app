import {ActionFunctionArgs, json} from "react-router-dom";
import axiosConfig from "config/axiosConfig";
import AuthenticateResponse from "payload/response/AuthenticateResponse";
import {setCookie} from "utils/Cookie";

/**
 * Handles form submission for user authentication.
 * Processes form data, sends a POST request to authenticate the user,
 * sets cookies for access and refresh tokens, and manages session storage.
 * If authentication fails, it returns an error message.
 * @param request An object containing the HTTP request details, including form data with `username` and `password`.
 * @returns Redirects to the home page on success, otherwise returns an object with an error message.
 */
export default async function action({request}: ActionFunctionArgs<'post'>) {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);

    if (!payload.username || !payload.password) {
        return {message: 'Username and password are required.'};
    }

    try {
        const response = await axiosConfig.post<AuthenticateResponse>('/auth/authenticate', payload);
        const {user_id, access_token, refresh_token} = response.data;
        const accessTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        const refreshTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

        setCookie('access_token', access_token, accessTokenExpiry);
        setCookie('refresh_token', refresh_token, refreshTokenExpiry);
        sessionStorage.setItem('user_id', user_id);

        return {message: 'Successfully authenticated.', isAuthenticated: true}
    } catch (error: any) {
        if (error.response?.status === 401) {
            return {message: 'Invalid username or password.', isAuthenticated: false}
        } else {
            return json({message: 'An error occurred. Please try again later.'}, {status: 500});
        }
    }
}