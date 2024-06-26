import React from "react";
import Footer from "components/Footer";
import {render, screen} from "@testing-library/react";

describe("The Footer component", () => {
    test("renders without crashing", () => {
        const {container} = render(<Footer/>);

        expect(container).toMatchSnapshot();
    });

    test("contains the correct text", () => {
        render(<Footer/>);

        expect(screen.getByText("© 2024 Alumni FIL")).toBeInTheDocument();
    });
});
