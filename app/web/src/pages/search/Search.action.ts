import {ActionFunctionArgs} from "react-router-dom";
import axiosConfig from "config/axiosConfig";
import {getAccessToken} from "utils/Token";
import {SearchResponse} from "payload/response/SearchResponse";

export default async function action({request}: ActionFunctionArgs<'post'>) {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);

    if (!payload.name && !payload.graduationYear && !payload.currentCompany && !payload.city) {
        return {message: 'At least one search criteria is required.'};
    }

    try {
        const response = await axiosConfig.get<SearchResponse>('/search', {
            params: payload,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        });
        return response.data.results;
    } catch (error: any) {
        return {message: 'Failed to fetch data.'};
    }
}