import {redirect} from "react-router-dom";
import {isAuthenticated} from "routing/Router";

export default function loader() {
    if (isAuthenticated()) {
        return redirect('/');
    }

    const lastConnectedUser = localStorage.getItem('lastConnectedUser');

    return { username: lastConnectedUser ?? '' };
}
