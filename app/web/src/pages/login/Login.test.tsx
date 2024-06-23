import React from "react";
import Login from "pages/login/Login";
import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginAction from "pages/login/Login.action";
import LoginLoader from "pages/login/Login.loader";
import axiosConfig from "config/axiosConfig";

// Mock axios configuration
jest.mock('config/axiosConfig');
const axiosConfigMock = axiosConfig as jest.Mocked<typeof axiosConfig>;

describe("The Login page functionality", () => {
    const router = createMemoryRouter(
        [
            {
                path: '/login',
                element: <Login />,
                loader: LoginLoader,
                action: LoginAction,
                children: []
            }
        ],
        {
            initialEntries: ['/login']
        }
    );

    describe("Render and basic elements", () => {
        test("The Login page renders without crashing", () => {
            const { container } = render(<RouterProvider router={router} />);
            expect(container).toMatchSnapshot();
        });

        test("The Login page contains a header with the correct text", () => {
            render(<RouterProvider router={router} />);
            expect(screen.getByText('Welcome to Alumni FIL')).toBeInTheDocument();
            expect(screen.getByText('Login to access administrative features')).toBeInTheDocument();
        });

        test("The Login page contains a form with the correct fields", () => {
            render(<RouterProvider router={router} />);
            expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        });

        test("The Login page contains a submit button", () => {
            render(<RouterProvider router={router} />);
            expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        });
    });

    describe("Given a non-authenticated user on the Login page", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("When the user submits the form without entering any data, then an error message is displayed", async () => {
            render(<RouterProvider router={router} />);
            const loginButton = screen.getByRole('button', { name: /login/i });

            userEvent.click(loginButton);

            expect(await screen.findByText('Username and password are required.')).toBeInTheDocument();
        });

        test("When the user submits the form with invalid data, then an error message is displayed", async () => {
            render(<RouterProvider router={router} />);
            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole('button', { name: /login/i });

            // Mock axiosConfig.post to return an error
            axiosConfigMock.post.mockRejectedValue({ response: { status: 401 } });

            userEvent.type(usernameInput, 'testuser');
            userEvent.type(passwordInput, 'password');
            userEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
            });
        });
    });
});