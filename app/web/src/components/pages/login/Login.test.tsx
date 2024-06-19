import React, {act} from "react";
import Login from "components/pages/login/Login";
import {createMemoryRouter, RouterProvider} from "react-router-dom";


test("The Login page renders correctly", () => {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: <Login />,
                children: []
            }
        ]
    );

    const tree = act(() => <RouterProvider router={router} />);

    expect(tree).toMatchSnapshot();
});
