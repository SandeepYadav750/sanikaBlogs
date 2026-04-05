import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

// Async thunk for fetching comments
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/comment/${blogId}/comment`, {
        withCredentials: true,
      });

      console.log("Fetch comments response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Fetch comments error:",
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Async thunk for creating a comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ blogId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/comment/${blogId}/create`,
        { content },
        {
          withCredentials: true,
        },
      );

      console.log("Create comment response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Create comment error:",
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const deleteComment = createAsyncThunk(
  "comments/deleteComment", // Fixed the name
  async (commentId, { rejectWithValue }) => {
    // Only commentId parameter
    try {
      const res = await axios.delete(`${API}/comment/${commentId}/delete`, {
        withCredentials: true,
      });

      console.log("delete comment response:", res.data);
      return res.data;
    } catch (error) {
      console.error(
        "Delete comment error:",
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const editComment = createAsyncThunk(
  "comment/editComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    // Only commentId parameter
    try {
      const res = await axios.put(
        `${API}/comment/${commentId}/edit`,
        { content: content },
        {
          withCredentials: true,
        },
      );

      console.log("edit comment response:", res.data);
      return res.data;
    } catch (error) {
      console.error("edit comment error:", error.res?.data || error.message);
      return rejectWithValue(error.res?.data || error.message);
    }
  },
);

export const likedComment = createAsyncThunk(
  "comment/likedComment",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/comment/${id}/like`, {
        withCredentials: true,
      });

      console.log("like comment response:", res.data);
      return res.data;
    } catch (error) {
      console.error("like comment error:", error.res?.data || error.message);
      return rejectWithValue(error.res?.data || error.message);
    }
  },
);

export const getAllComment = createAsyncThunk(
  "comment/getAllComment",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/comment/my-blogs/comments`, {
        withCredentials: true,
      });

      console.log("fetch all comment response:", res.data);
      return res.data;
    } catch (error) {
      console.error(
        "fetch all comment error:",
        error.res?.data || error.message,
      );
      return rejectWithValue(error.res?.data || error.message);
    }
  },
);

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    allComments: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments cases
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Handle different response structures
        const commentsData =
          action.payload?.comments || action.payload?.data || action.payload;
        state.comments = Array.isArray(commentsData) ? commentsData : [];
        console.log("Comments set in state:", state.comments);
        state.message = action.payload.message;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch comments";
        console.error("Fetch comments rejected:", state.error);
      })
      // Create comment cases
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        // Add new comment to the beginning of the array
        const newComment = action.payload?.comment || action.payload?.data;
        if (newComment) {
          state.comments = [newComment, ...state.comments];
          console.log("New comment added:", newComment);
        }
        state.message = action.payload.message;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create comment";
        console.error("Create comment rejected:", state.error);
      })
      // Delete comment cases
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;

        // Get the comment ID from action.payload.commentId or action.meta.arg
        const commentId = action.payload?.commentId || action.meta.arg;

        if (commentId) {
          state.comments = state.comments.filter(
            (comment) => (comment._id || comment.id) !== commentId,
          );
        }
        state.message =
          action.payload?.message || "Comment deleted successfully";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to Delete comment";
        console.error("Delete comment rejected:", state.error);
      })
      // Edit comment cases
      .addCase(editComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.loading = false;

        // Get the updated comment from payload
        const updatedComment =
          action.payload?.comment || action.payload?.data?.comment;
        const commentId = updatedComment?._id || action.meta.arg?.commentId;
        const newContent = updatedComment?.content || action.meta.arg?.content;

        if (commentId && newContent) {
          state.comments = state.comments.map((item) =>
            item._id === commentId ? { ...item, content: newContent } : item,
          );
          console.log("Comment edited:", commentId);
        }
        state.message = action.payload?.message || "Comment Edit successfully";
      })
      .addCase(editComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to Edit comment";
        console.error("Edit comment rejected:", state.error);
      })

      // like comments cases
      .addCase(likedComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(likedComment.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Handle different response structures
        const updatedComment = action.payload?.comment;
        const commentId = updatedComment?._id;

        state.comments = state.comments.map((item) =>
          item._id === commentId ? updatedComment : item,
        );
        console.log("like set in state:", state.comments);
        state.message = action.payload.message;
      })
      .addCase(likedComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch liked data";
        console.error("Fetch liked data rejected:", state.error);
      })

      // getAllComment comments cases
      .addCase(getAllComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getAllComment.fulfilled, (state, action) => {
        state.loading = false;
        // state.comments = action.payload;
        state.allComments = action.payload;
        console.log("getAllComment set in state:", state.comments);
        state.message = action.payload.message;
      })
      .addCase(getAllComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch liked data";
        console.error("Fetch liked data rejected:", state.error);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
