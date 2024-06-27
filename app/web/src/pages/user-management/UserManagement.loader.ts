import {decodeTokenPayload, getAccessToken} from "../../utils/Token";

export default function loader() {
    const accessToken = getAccessToken()
    const decoded = decodeTokenPayload(accessToken)
    console.log(decodeTokenPayload(accessToken))
    if (!decoded || !decoded.authorities.includes('ROLE_ADMIN')) {
        throw new Response("You are not authorized to access this page", {status: 403, statusText: "Forbidden"}); // 403 Forbidden
    }

    return null;
}