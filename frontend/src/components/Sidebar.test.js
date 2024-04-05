import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Sidebar from "./Sidebar";
import { UserProvider } from "../testProvider";

it("renders without crashing", function () {
    render(
        <MemoryRouter>
            <UserProvider>
                <Sidebar />
            </UserProvider>
        </MemoryRouter>,
    );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter>
            <UserProvider>
                <Sidebar />
            </UserProvider>
        </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
});