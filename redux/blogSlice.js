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

// 🔥 Fetch User's Liked Blogs
export const fetchUserLikedBlogs = createAsyncThunk(
  "blog/fetchUserLikedBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/blog/my-blogs/likes`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch liked blogs",
      );
    }
  },
);
// ==========================
// 🔥 Create Blog
// ==========================
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (userBlog, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/blog`, userBlog, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      return res.data;
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
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
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
// 🔥 LIKE/DISLIKE BLOG
// ==========================
export const toggleLikeBlog = createAsyncThunk(
  "blog/toggleLikeBlog",
  async ({ blogId, action }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/blog/${blogId}/${action}`, {
        withCredentials: true,
      });
      return {
        blogId,
        action,
        data: res.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle like"
      );
    }
  }
);

// ==========================
// 🔥 INITIAL STATE
// ==========================
const initialState = {
  blogs: [], // Initialize as empty array
  blog: null,
  likedBlogs: [], // Initialize as empty array
  loading: false,
  message: null,
  error: null,
  isAuthenticated: false,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
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
        // Handle different response structures
        const blogsData = action.payload.blogs || action.payload;
        state.blogs = Array.isArray(blogsData) ? blogsData : [];
        state.error = null;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.blogs = []; // Reset to empty array on error
      })

      // ==========================
      // FETCH USER LIKED BLOGS
      // ==========================
      .addCase(fetchUserLikedBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLikedBlogs.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures
        const likedData = action.payload.likedBlogs || action.payload;
        state.likedBlogs = Array.isArray(likedData) ? likedData : [];
        state.error = null;
      })
      .addCase(fetchUserLikedBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.likedBlogs = []; // Reset to empty array on error
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
        if (action.payload.blog) {
          state.blogs = [action.payload.blog, ...state.blogs];
        }
        state.isAuthenticated = true;
        state.message = action.payload.message;
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
        state.blog = updatedBlog;
        
        if (updatedBlog && Array.isArray(state.blogs)) {
          const index = state.blogs.findIndex(
            (item) => item?._id === updatedBlog?._id,
          );
          if (index !== -1) {
            state.blogs[index] = updatedBlog;
          }
        }

        state.isAuthenticated = true;
        state.message = action.payload.message;
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
        if (Array.isArray(state.blogs)) {
          state.blogs = state.blogs.filter(
            (blog) => blog?._id !== action.payload?.id,
          );
        }
        if (state.blog?._id === action.payload?.id) {
          state.blog = null;
        }
        state.message = action.payload?.message;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // TOGGLE LIKE/DISLIKE BLOG
      // ==========================
      .addCase(toggleLikeBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLikeBlog.fulfilled, (state, action) => {
        state.loading = false;
        const { blogId, action: likeAction, data } = action.payload;
        
        // Update likedBlogs array
        if (likeAction === 'like') {
          if (!state.likedBlogs.includes(blogId)) {
            state.likedBlogs.push(blogId);
          }
        } else {
          state.likedBlogs = state.likedBlogs.filter(id => id !== blogId);
        }
        
        // Update the blog in the blogs array
        if (Array.isArray(state.blogs)) {
          const blogIndex = state.blogs.findIndex(blog => blog?._id === blogId);
          if (blogIndex !== -1) {
            const blog = state.blogs[blogIndex];
            const userId = data?.userId;
            
            if (userId) {
              if (likeAction === 'like') {
                if (!blog.likes?.includes(userId)) {
                  blog.likes = [...(blog.likes || []), userId];
                }
              } else {
                blog.likes = (blog.likes || []).filter(id => id !== userId);
              }
              
              state.blogs[blogIndex] = { ...blog };
            }
          }
        }
        
        // Update single blog if it's the same
        if (state.blog && state.blog._id === blogId) {
          const userId = data?.userId;
          if (userId) {
            if (likeAction === 'like') {
              if (!state.blog.likes?.includes(userId)) {
                state.blog.likes = [...(state.blog.likes || []), userId];
              }
            } else {
              state.blog.likes = (state.blog.likes || []).filter(id => id !== userId);
            }
            state.blog = { ...state.blog };
          }
        }
        
        state.message = data?.message;
      })
      .addCase(toggleLikeBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;