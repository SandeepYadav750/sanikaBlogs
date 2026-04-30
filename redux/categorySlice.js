import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

// Fetch all All Users categories
export const fetchAllUsersCategories = createAsyncThunk(
  "category/fetchAllUsersCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/category/allUsersCategories`, {
        withCredentials: false,
      });
      console.log("allUsersCategories:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/category/allCategories`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Create new category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/category/create`,
        categoryData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API}/category/${id}/delete`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Update category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/category/${id}/edit/`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log("API response for updateCategory:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    allUsersCategories: [],
    loading: false,
    error: null,
    totalCategories: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // In your categorySlice.js, update the fetchCategories.fulfilled case:
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out any null values
        state.categories = (action.payload.data || []).filter(
          (cat) => cat && cat._id,
        );
        state.totalCategories =
          action.payload.totalCategories || state.categories.length;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      })

      // Fetch All Users Categories
      .addCase(fetchAllUsersCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // In your categorySlice.js, update the fetchAllUsersCategories.fulfilled case:
      .addCase(fetchAllUsersCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out any null values
        state.allUsersCategories = (action.payload.categories || []).filter(
          (cat) => cat && cat._id,
        );
        state.totalCategories =
          action.payload.totalCategories || state.allUsersCategories.length;
        state.error = null;
      })
      .addCase(fetchAllUsersCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = [action.payload.category, ...state.categories];
        state.totalCategories += 1;
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create category";
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Fix: Filter out the deleted category using id
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload.id,
        );
        state.totalCategories = state.categories.length;
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete category";
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Fix: Update category in the array using the id from action payload
        const { id, name } = action.payload;
        const index = state.categories.findIndex((cat) => cat._id === id);
        if (index !== -1) {
          state.categories[index] = { ...state.categories[index], name };
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update category";
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
