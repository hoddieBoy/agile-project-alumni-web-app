/**
 * Sets a cookie with the specified name, value, and expiration date.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Date} expiry - The expiration date of the cookie.
 */
export function setCookie(name: string, value: string, expiry: Date): void {
    try {
        document.cookie = `${name}=${value}; expires=${expiry.toUTCString()}; path=/`;
    } catch (error) {
        console.error('Failed to set cookie:', error);
    }
}

/**
 * Retrieves the value of the cookie with the specified name.
 * @param {string} name - The name of the cookie.
 * @returns {string | null} The value of the cookie, or null if not found.
 */
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

/**
 * Deletes the cookie with the specified name.
 * @param {string} name - The name of the cookie.
 */
export function deleteCookie(name: string): void {
    try {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch (error) {
        console.error('Failed to delete cookie:', error);
    }
}