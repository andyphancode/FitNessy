import React from "react";
import { render } from "@testing-library/react";
import Workouts from "./Workouts";

it("matches snapshot", function () {
    const {asFragment } = render(
        <Workouts/>
    );
    expect(asFragment()).toMatchSnapshot();
})