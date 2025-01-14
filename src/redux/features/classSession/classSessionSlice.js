import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../../utils/api";

// Async actions
export const fetchClassSessions = createAsyncThunk(
  "classSession/fetchClassSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/class-sessions`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch sessions");
      return rejectWithValue(error.response?.data || "Error fetching sessions");
    }
  }
);

export const createClassSession = createAsyncThunk(
  "classSession/createClassSession",
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/class-session`, sessionData);
      toast.success("Session created successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to create session");
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateClassSession = createAsyncThunk(
  "classSession/updateClassSession",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/class-session/${id}`, updatedData);
      toast.success("Session updated successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to update session");
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteClassSession = createAsyncThunk(
  "classSession/deleteClassSession",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/class-session/${id}`);
      toast.success("Session deleted successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to delete session");
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const classSessionSlice = createSlice({
  name: "classSession",
  initialState: {
    sessions: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClassSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload?.data || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(fetchClassSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createClassSession.fulfilled, (state, action) => {
        state.sessions.push(action.payload.session);
      })
      .addCase(updateClassSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(
          (session) => session._id === action.payload.session._id
        );
        if (index !== -1) {
          state.sessions[index] = action.payload.session;
        }
      })
      .addCase(deleteClassSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(
          (session) => session._id !== action.meta.arg
        );
      });
  },
});

export default classSessionSlice.reducer;
