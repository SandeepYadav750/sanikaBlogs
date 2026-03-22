import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

// 🔥 Fetch All Blogs
export const fetchAllBlogs = createAsyncThunk(
  "blog/fetchAllBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/blog/list`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch blogs",
      );
    }
  },
);

// 🔥 Create Blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (userBlog, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/blog`, userBlog, {
        headers: {
          "Content-Type": "multipart/form-data", // For file updates
        },
        withCredentials: true,
      });
      return res.data; // Return the full response data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Blog Creating Failed",
      );
    }
  },
);

// ==========================
// 🔥 UPDATE BLOG
// ==========================
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/blog/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // For file updates
        },
        withCredentials: true, // FormData hai, headers mat lagao
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Blog Update Failed",
      );
    }
  },
);

// ==========================
// 🔥 DELETE BLOG
// ==========================
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API}/blog/delete/${id}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete blog",
      );
    }
  },
);

// ==========================
// 🔥 INITIAL STATE
// ==========================
const initialState = {
  blogs: [],
  blog: null,
  loading: false,
  message: null,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    // optional reset
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ==========================
      // FETCH ALL BLOGS
      // ==========================
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs || action.payload;
        state.error = null;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // CREATE BLOG
      // ==========================
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload.blog;
        state.blogs.push(action.payload.blog); // list update
        state.isAuthenticated = true;
        state.message = action.payload.message; // 👈 success message
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // UPDATE BLOG
      // ==========================
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedBlog = action.payload.blog;
        // ✅ Update the single blog state
        state.blog = updatedBlog;
        // ✅ Update the existing blog in the blogs array (not add new)
        const index = state.blogs.findIndex(
          (item) => item._id === updatedBlog._id,
        );
        if (index !== -1) {
          // Replace the existing blog at the found index
          state.blogs[index] = updatedBlog;
        }

        state.isAuthenticated = true;
        state.message = action.payload.message; // 👈 success message
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // DELETE BLOG
      // ==========================

      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        // Remove deleted blog from the list
        state.blogs = state.blogs.filter(
          (blog) => blog._id !== action.payload.id,
        );
        // Clear single blog if it was deleted
        if (state.blog?._id === action.payload.id) {
          state.blog = null;
        }
        state.message = action.payload.message;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
