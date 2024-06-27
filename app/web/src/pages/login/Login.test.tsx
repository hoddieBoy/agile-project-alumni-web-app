import React from "react";
import Login from "pages/login/Login";
import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginAction from "pages/login/Login.action";
import axiosConfig from "config/axiosConfig";
import {AuthContext, AuthContextType} from 'context/AuthContext';

// Mock axios configuration
jest.mock('config/axiosConfig');
const axiosConfigMock = axiosConfig as jest.Mocked<typeof axiosConfig>;

describe("The Login page functionality", () => {
    const mockLogin = (accessToken: string, refreshToken: string) => jest.fn();

    const router = createMemoryRouter(
        [
            {
                path: '/login',
                element: <Login/>,
                action: LoginAction,
                children: []
            }
        ],
        {
            initialEntries: ['/login']
        }
    );

    const renderWithContext = () => {
        return render(
            <AuthContext.Provider
                value={{isAuthenticated: false, user: null, login: mockLogin, logout: jest.fn()} as AuthContextType}>
                <RouterProvider router={router}/>
            </AuthContext.Provider>
        );
    };

    describe("Render and basic elements", () => {
        test("The Login page renders without crashing", () => {
            const {container} = renderWithContext();
            expect(container).toMatchSnapshot();
        });

        test("The Login page contains a header with the correct text", () => {
            renderWithContext();
            expect(screen.getByText('Welcome to Alumni FIL')).toBeInTheDocument();
            expect(screen.getByText('Login to access administrative features')).toBeInTheDocument();
        });

        test("The Login page contains a form with the correct fields", () => {
            renderWithContext();
            expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        });

        test("The Login page contains a submit button", () => {
            renderWithContext();
            expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
        });
    });

    describe("Given a non-authenticated user on the Login page", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("When the user submits the form without entering any data, then an error message is displayed", async () => {
            renderWithContext();
            const loginButton = screen.getByRole('button', {name: /login/i});

            userEvent.click(loginButton);

            expect(await screen.findByText('Username and password are required.')).toBeInTheDocument();
        });

        test("When the user submits the form with invalid data, then an error message is displayed", async () => {
            renderWithContext();
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole('button', {name: /login/i});

            // Mock axiosConfig.post to return an error
            axiosConfigMock.post.mockRejectedValue({response: {status: 401}});

            userEvent.type(usernameInput, 'testuser');
            userEvent.type(passwordInput, 'password');
            userEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
            });
        });
    });
});
