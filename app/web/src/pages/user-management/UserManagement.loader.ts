import {decodeTokenPayload, getAccessToken} from "../../utils/Token";
import {UserResponse} from "../../payload/response/UserResponse";
import axiosConfig from "../../config/axiosConfig";

export default async function loader() {
    const accessToken = getAccessToken()
    const decoded = decodeTokenPayload(accessToken)
    console.log(decodeTokenPayload(accessToken))
    if (!decoded || !decoded.authorities.includes('ROLE_ADMIN')) {
        throw new Response("You are not authorized to access this page", {status: 403, statusText: "Forbidden"}); // 403 Forbidden
    }

    let users: UserResponse[] = []

    try {
        const response = await axiosConfig.get<UserResponse[]>('/users/all-users', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log(response.data)
        users = response.data
    } catch (e) {
        console.error(e)
    }

    return {users}
}