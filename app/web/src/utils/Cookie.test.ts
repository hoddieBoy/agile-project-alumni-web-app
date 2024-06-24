import {deleteCookie, getCookie, setCookie} from 'utils/Cookie';

describe('setCookie', () => {
    it('sets a cookie', () => {
        const name = 'testCookie';
        const value = 'testValue';
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        setCookie(name, value, expiry);

        expect(document.cookie).toContain(`${name}=${value}`);
    });
});

describe('getCookie', () => {
    it('gets a cookie value', () => {
        const name = 'testCookie';
        const value = 'testValue';
        document.cookie = `${name}=${value}`;

        expect(getCookie(name)).toBe(value);
    });

    it('returns null for a non-existent cookie', () => {
        expect(getCookie('nonExistentCookie')).toBeNull();
    });
});

describe('deleteCookie', () => {
    it('deletes a cookie', () => {
        const name = 'testCookie';
        const value = 'testValue';
        document.cookie = `${name}=${value}`;
        deleteCookie(name);

        expect(getCookie(name)).toBeNull();
    });
});