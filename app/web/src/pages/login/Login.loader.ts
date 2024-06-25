export default function loader() {

    const lastConnectedUser = localStorage.getItem('lastConnectedUser');

    return {username: lastConnectedUser ?? ''};
}
