import React from "react";
import { render } from "@testing-library/react";
import Register from "./Register";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});