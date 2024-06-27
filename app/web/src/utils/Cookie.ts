export function setCookie(name: string, value: string, expiry: Date): void {
    try {
        document.cookie = `${name}=${value}; expires=${expiry.toUTCString()}; path=/`;
    } catch (error) {
        console.error('Failed to set cookie:', error);
    }
}

export function getCookie(name: string): string | null {
    try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === name) {
                return cookieValue ? cookieValue.trim() : null;
            }
        }
        return null;
    } catch (error) {
        console.error('Failed to get cookie:', error);
        return null;
    }
}

export function deleteCookie(name: string): void {
    try {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch (error) {
        console.error('Failed to delete cookie:', error);
    }
}