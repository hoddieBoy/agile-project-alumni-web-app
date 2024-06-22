import { ActionFunctionArgs, json, redirect } from "react-router-dom";
import axiosConfig from "config/axiosConfig";
import AuthenticateResponse from "payload/response/AuthenticateResponse";
import { setCookie } from "utils/Cookie";

/**
 * Handles form submission for user authentication.
 * Processes form data, sends a POST request to authenticate the user,
 * sets cookies for access and refresh tokens, and manages session storage.
 * If authentication fails, it returns an error message.
 * @param request An object containing the HTTP request details, including form data with `username` and `password`.
 * @returns Redirects to the home page on success, otherwise returns an object with an error message.
 */
export default async function action({ request }: ActionFunctionArgs<'post'>) {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);

    if (!payload.username || !payload.password) {
        return { message: 'Username and password are required.' };
    }

    try {
        const response = await axiosConfig.post<AuthenticateResponse>('/authenticate', payload);
        const { user_id, access_token, refresh_token } = response.data;
        const accessTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        const refreshTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

        setCookie('access_token', access_token, accessTokenExpiry);
        setCookie('refresh_token', refresh_token, refreshTokenExpiry);
        sessionStorage.setItem('user_id', user_id);
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.debug('<<Login.action.ts>>', 'Invalid username or password.');
            return { message: 'Invalid username or password.' };
        } else {
            console.debug('<<Login.action.ts>>', error);
            return json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
        }
    }
    console.debug('<<Login.action.ts>>', 'User authenticated successfully.');
    return redirect('/');
}