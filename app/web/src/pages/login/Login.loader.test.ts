import {redirect} from 'react-router-dom';
import {isAuthenticated} from 'routing/Router';
import loader from 'pages/login/Login.loader';

// Mock the dependencies
jest.mock('react-router-dom', () => ({
    redirect: jest.fn(),
}));

jest.mock('routing/Router', () => ({
    isAuthenticated: jest.fn(),
}));

describe('loader function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to "/" if the user is authenticated', () => {
        (isAuthenticated as jest.Mock).mockReturnValue(true);

        const result = loader();

        expect(redirect).toHaveBeenCalledWith('/');
        expect(result).toBeUndefined();
    });

    it('should return username from localStorage if the user is not authenticated', () => {
        (isAuthenticated as jest.Mock).mockReturnValue(false);
        localStorage.setItem('lastConnectedUser', 'testUser');

        const result = loader();

        expect(redirect).not.toHaveBeenCalled();
        expect(result).toEqual({username: 'testUser'});
    });

    it('should return an empty username if there is no lastConnectedUser in localStorage', () => {
        (isAuthenticated as jest.Mock).mockReturnValue(false);
        localStorage.removeItem('lastConnectedUser');

        const result = loader();

        expect(redirect).not.toHaveBeenCalled();
        expect(result).toEqual({username: ''});
    });
});