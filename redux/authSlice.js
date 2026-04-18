import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

// 🔥 REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/user/register`, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data; // Return the full response data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed CUSTOM",
      );
    }
  },
);

// 🔥 LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/user/login`, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login Response:", res.data);
      console.log("Cookies set:", document.cookie);

      // Store token in localStorage as backup
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        // Cookie mein bhi store karo (server-side ke liye)
        // document.cookie = `authToken=${res.data.token}; path=/; max-age=604800; SameSite=Lax`;
        // max-age=604800 = 7 days
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// 🔥 LOGOUT THUNK
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/user/logout`, {
        withCredentials: true,
      });

      // Clear localStorage
      localStorage.removeItem("authToken");

      return res.data; // { success, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

// 🔥 Update User THUNK
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/user/profile/update`, userData, {
        withCredentials: true,
      });

      return res.data; // { success, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

// 🔥 getAllUsers
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/user/all-users`, {
        withCredentials: true,
      });
      return res.data; // Return the full response data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "All Users fetch failed ",
      );
    }
  },
);

// 🔥 Check Auth Status - ADD THIS NEW THUNK
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      // Try to get token from cookie or localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No token found");
      }

      // Verify token with backend
      const res = await axios.get(`${API}/user/verify`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Not authenticated",
      );
    }
  },
);

// 🧠 SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    allUsers: null,
    isAuthenticated: false,
    message: null, // 👈 ADD THIS
    loading: false,
    error: null,
  },
  reducers: {
    // 🔥 LOGOUT (sync action)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("authToken");
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user.user;
        state.isAuthenticated = true;
        state.message = action.payload.message; // 👈 success message
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token; // 👈 success token
        state.isAuthenticated = true;
        state.message = action.payload.message; // 👈 success message
      })
      // .addCase(loginUser.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const { token, user, message } = action.payload;

      //   state.token = token || null;
      //   state.user = user || null;
      //   state.isAuthenticated = !!token; // Only true if token has truthy value
      //   state.message = message;
      // })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔥 LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.message = action.payload.message;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.message = action.payload.message; // 👈 success message
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload; // 👈 Store all users
        state.isAuthenticated = true;
        state.message = action.payload.message; // 👈 success message
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CHECK AUTH STATUS
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
