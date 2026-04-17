import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeSlice from "./themeSlice"; // 👈 IMPORT THEME SLICE
import blogSlice from "./blogSlice";
import commentSlice from "./commentSlice";
import categorySlice from "./categorySlice"; // 👈 IMPORT CATEGORY SLICE
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import storage from "redux-persist/lib/storage";
import storage from "./storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice, // 👈 ADD THEME SLICE TO ROOT REDUCER
  blog: blogSlice,
  comment: commentSlice,
  category: categorySlice, // 👈 ADD CATEGORY SLICE TO ROOT REDUCER
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export default store;
