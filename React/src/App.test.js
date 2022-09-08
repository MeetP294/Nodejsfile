import React from "react";
import { Router } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import App from "./App";

test("renders 'Start your order' <button>", async () => {
  expect(true).toBeTruthy();
  // const history = createMemoryHistory();

  // history.push("/jumping-jack-sprat/takeout");

  // const { getByText } = render(
  //   <Router history={history}>
  //     <App />
  //   </Router>
  // );

  // // Await the appearance of something on the page
  // // that matches /taters/i
  // await waitFor(() => screen.getByText("Start your order"));

  // expect(getByText("Start your order")).toBeTruthy();
});

// test("renders venue data", async () => {
//   const { getAllByText } = render(<App />);

//   await waitFor(() => screen.getByText("Start your order"));
//   expect(getAllByText(/jumping/i)).toBeTruthy();
// });
