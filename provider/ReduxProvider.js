"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { SocketContextProvider } from "./SocketCotextProvider";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <SocketContextProvider>{children}</SocketContextProvider>
    </Provider>
  );
}
