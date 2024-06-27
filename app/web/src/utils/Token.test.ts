import {decodeTokenPayload, getAccessToken, getRefreshToken, isTokenValid} from 'utils/Token';
import {getCookie} from 'utils/Cookie';

// Mock the getCookie function
jest.mock('utils/Cookie', () => ({
    getCookie: jest.fn(),
}));

describe('decodeTokenPayload', () => {
    it('decodes a valid token', () => {
        const payload = {exp: Date.now() / 1000 + 60};
        const token = createTokenWithPayload(payload);
        expect(decodeTokenPayload(token)).toEqual(payload);
    });

    it('returns null for a malformed token', () => {
        expect(decodeTokenPayload('malformed.token')).toBeNull();
    });
});

describe('isTokenValid', () => {
    it('returns true for a valid token', () => {
        const validToken = createTokenWithExpiration(Date.now() / 1000 + 60); // Token expires in 60 seconds
        expect(isTokenValid(validToken)).toBe(true);
    });

    it('returns false for an expired token', () => {
        const expiredToken = createTokenWithExpiration(Date.now() / 1000 - 60); // Token expired 60 seconds ago
        expect(isTokenValid(expiredToken)).toBe(false);
    });

    it('returns false for a malformed token', () => {
        const malformedToken = 'malformed.token';
        expect(isTokenValid(malformedToken)).toBe(false);
    });
});

describe('getAccessToken', () => {
    it('returns the token if it is valid', () => {
        const validToken = createTokenWithExpiration(Date.now() / 1000 + 60);
        (getCookie as jest.Mock).mockReturnValue(validToken);
        expect(getAccessToken()).toBe(validToken);
    });

    it('returns an empty string if the token is not present', () => {
        (getCookie as jest.Mock).mockReturnValue('');
        expect(getAccessToken()).toBe('');
    });

    it('returns an empty string if the token is invalid', () => {
        const invalidToken = createTokenWithExpiration(Date.now() / 1000 - 60);
        (getCookie as jest.Mock).mockReturnValue(invalidToken);
        expect(getAccessToken()).toBe('');
    });

    it('returns an empty string if the token is malformed', () => {
        (getCookie as jest.Mock).mockReturnValue('malformed.token');
        expect(getAccessToken()).toBe('');
    });
});

describe('getRefreshToken', () => {
    it('returns the token if it is present', () => {
        const refreshToken = 'valid_refresh_token';
        (getCookie as jest.Mock).mockReturnValue(refreshToken);
        expect(getRefreshToken()).toBe(refreshToken);
    });

    it('returns an empty string if the token is not present', () => {
        (getCookie as jest.Mock).mockReturnValue('');
        expect(getRefreshToken()).toBe('');
    });
});

// Helper function to create a JWT token with a specific expiration time
function createTokenWithExpiration(expiration: number): string {
    const payload = {
        exp: expiration,
    };
    const base64Payload = btoa(JSON.stringify(payload));
    return `header.${base64Payload}.signature`;
}

// Helper function to create a JWT token with a specific payload
function createTokenWithPayload(payload: Record<string, any>): string {
    const base64Payload = btoa(JSON.stringify(payload));
    return `header.${base64Payload}.signature`;
}
