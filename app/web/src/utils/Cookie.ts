export function setCookie(name: string, value: string, expiry: Date) {
    document.cookie = `${name}=${value}; expires=${expiry.toUTCString()}; path=/`;
}

export function getCookie(name: string) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }
    return null;
}

export function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

