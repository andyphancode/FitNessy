import React from "react";
import { render } from "@testing-library/react";
import Routing from "./Routing";
import { MemoryRouter } from "react-router-dom";
import { UserProvider } from "../testProvider";

it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <UserProvider>
                <Routing/>
            </UserProvider>
        </MemoryRouter>
    )
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <Routing/>
            </UserProvider>
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
}); 