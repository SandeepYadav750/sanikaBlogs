import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeSlice from "./themeSlice"; // 👈 IMPORT THEME SLICE

const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice, // 👈 ADD THEME SLICE
  },
});

export default store;