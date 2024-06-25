import {redirect} from "react-router-dom";
import {isAuthenticated} from "utils/Auth";

export default function loader() {
    if (isAuthenticated()) {
        return redirect('/');
    }

    const lastConnectedUser = localStorage.getItem('lastConnectedUser');

    return { username: lastConnectedUser ?? '' };
}
