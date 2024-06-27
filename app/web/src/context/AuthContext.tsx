import React, {createContext, ReactNode, useCallback, useEffect, useState} from 'react';
import {isAuthenticatedSync, logout as performLogout} from 'utils/Auth';
import {deleteCookie, setCookie} from 'utils/Cookie';
import {decodeTokenPayload, getAccessToken, getRefreshToken, refreshAccessToken} from 'utils/Token';

export interface AuthContextType {
    isAuthenticated: boolean;
    user: { username: string, roles: string[] } | null;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => {
    },
    logout: () => {
    }
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAuthenticatedSync());
    const [user, setUser] = useState<{ username: string, roles: string[] } | null>(() => {
        const token = getAccessToken();
        if (token) {
            const decoded = decodeTokenPayload(token);
            return decoded ? {username: decoded.sub, roles: decoded.authorities} : null;
        }
        return null;
    });

    useEffect(() => {
        if (!isAuthenticated) {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                refreshAccessToken(refreshToken)
                    .then((newAccessToken) => {
                        const decoded = decodeTokenPayload(newAccessToken);
                        if (decoded) {
                            setCookie('access_token', newAccessToken, new Date(Date.now() + 60 * 60 * 1000)); // 1 hour expiry
                            setUser({username: decoded.sub, roles: decoded.authorities});
                        }
                    })
                    .catch(() => {
                        performLogout();
                        setIsAuthenticated(false);
                        setUser(null);
                    });
            }
        }
    }, [isAuthenticated]);

    const login = useCallback((accessToken: string, refreshToken: string) => {

        setCookie('access_token', accessToken, new Date(Date.now() + 60 * 60 * 1000)); // 1 hour expiry
        setCookie('refresh_token', refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 1 week expiry

        const decoded = decodeTokenPayload(accessToken);
        if (!decoded) {
            return;
        }

        const username = decoded.sub;
        const roles = decoded.authorities;

        setUser({username, roles});
        setIsAuthenticated(true);
        console.debug('User logged in:', username, roles)
    }, []);

    const logout = useCallback(() => {
        performLogout();
        deleteCookie('access_token');
        deleteCookie('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};