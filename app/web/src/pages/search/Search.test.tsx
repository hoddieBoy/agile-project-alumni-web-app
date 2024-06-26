import React from "react";
import Search from "pages/search/Search";
import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchAction from "pages/search/Search.action";

describe("The Search page functionality", () => {
    const router = createMemoryRouter(
        [
            {
                path: '/search',
                element: <Search/>,
                action: SearchAction
            },
        ],
        {
            initialEntries: ['/search']
        }
    );

    describe("Render and basic elements", () => {
        test("The Search page renders without crashing", () => {
            const {container} = render(<RouterProvider router={router}/>);
            expect(container).toMatchSnapshot();
        });

        test("The Search page contains a form with the correct fields", () => {
            render(<RouterProvider router={router}/>);
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
        });

        test("The Search page contains a submit button", () => {
            render(<RouterProvider router={router}/>);
            expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument();
        });
    });

    describe("Given a user on the Search page", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("When the user submits the form without entering any data, then an error message is displayed", async () => {
            render(<RouterProvider router={router}/>);
            userEvent.click(screen.getByRole('button', {name: /search/i}));
            await waitFor(() => expect(screen.getByText('At least one search criteria is required.')).toBeInTheDocument());
        });
    });
});