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
      });
      console.log("SUCCESS RESPONSE:", res.data.user); // 👈 ADD THIS
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

// 🧠 SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    allUsers: null,
    isAuthenticated: false,
    message: null, // 👈 ADD THIS
    error: null,
  },
  reducers: {
    // 🔥 LOGOUT (sync action)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
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
        state.isAuthenticated = true;
        state.message = action.payload.message; // 👈 success message
      })
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
        state.isAuthenticated = false;
        state.message = action.payload.message; // 👈 toast ke liye
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
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
