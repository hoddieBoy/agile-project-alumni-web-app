import { ActionFunctionArgs, redirect } from "react-router-dom";
import axiosConfig from "config/axiosConfig";
import AuthenticateResponse from "payload/response/AuthenticateResponse";

export async function action({ request }: ActionFunctionArgs<'post'>) {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);

    if (!payload.username || !payload.password) {
        return { message: 'Username and password are required.' };
    }

    try {
        const response = await axiosConfig.post<AuthenticateResponse>('/auth/authenticate', payload);
        const data = response.data;
        const accessTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        const refreshTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

        document.cookie = `access_token=${data.access_token}; expires=${accessTokenExpiry.toUTCString()}; path=/`;
        document.cookie = `refresh_token=${data.refresh_token}; expires=${refreshTokenExpiry.toUTCString()}; path=/`;
        return redirect('/');
    } catch (error) {
        return { message: 'Invalid username or password.' };
    }
}
