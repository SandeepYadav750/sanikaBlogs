"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "../redux/store";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
      <ToastContainer />
    </Provider>
  );
}
