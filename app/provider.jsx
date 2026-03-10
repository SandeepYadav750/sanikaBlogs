"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import {persistStore} from "redux-persist";

export default function Providers({ children }) {

const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      {children}
        <ToastContainer />
        </PersistGate>
    </Provider>
  );
}
