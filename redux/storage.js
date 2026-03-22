// redux/storage.js
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage = (() => {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }

  try {
    return createWebStorage("local");
  } catch (error) {
    console.warn(
      "redux-persist storage unavailable, using noop storage.",
      error,
    );
    return createNoopStorage();
  }
})();

export default storage;
