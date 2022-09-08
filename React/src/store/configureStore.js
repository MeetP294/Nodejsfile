import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./slices";

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
}
