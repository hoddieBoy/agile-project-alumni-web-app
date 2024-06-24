import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {BrowserRouter, isRouteErrorResponse, useNavigate, useRouteError} from 'react-router-dom';
import ErrorPage from './ErrorPage';

// Mock the hooks
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useRouteError: jest.fn(),
    isRouteErrorResponse: jest.fn(),
    useNavigate: jest.fn(),
}));

describe('ErrorPage', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders 404 error correctly', () => {
        (useRouteError as jest.Mock).mockReturnValue({status: 404});
        (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(true);

        render(
            <BrowserRouter>
                <ErrorPage/>
            </BrowserRouter>
        );

        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText('Sorry, the page you visited does not exist.')).toBeInTheDocument();
        const backHomeButton = screen.getByText('Back Home');
        expect(backHomeButton).toBeInTheDocument();

        fireEvent.click(backHomeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('renders 403 error correctly', () => {
        (useRouteError as jest.Mock).mockReturnValue({status: 403});
        (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(true);

        render(
            <BrowserRouter>
                <ErrorPage/>
            </BrowserRouter>
        );

        expect(screen.getByText('403')).toBeInTheDocument();
        expect(screen.getByText('Sorry, you are not authorized to access this page.')).toBeInTheDocument();
        const loginButton = screen.getByText('Login');
        expect(loginButton).toBeInTheDocument();

        fireEvent.click(loginButton);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('renders 500 error correctly', () => {
        (useRouteError as jest.Mock).mockReturnValue({status: 500});
        (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(true);

        render(
            <BrowserRouter>
                <ErrorPage/>
            </BrowserRouter>
        );

        expect(screen.getByText('500')).toBeInTheDocument();
        expect(screen.getByText('Sorry, something went wrong.')).toBeInTheDocument();
        const goBackButton = screen.getByText('Go Back');
        expect(goBackButton).toBeInTheDocument();

        fireEvent.click(goBackButton);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('renders nothing when error is not a RouteErrorResponse', () => {
        (useRouteError as jest.Mock).mockReturnValue({status: 500});
        (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(false);

        const {container} = render(
            <BrowserRouter>
                <ErrorPage/>
            </BrowserRouter>
        );

        expect(container).toBeEmptyDOMElement();
    });
});