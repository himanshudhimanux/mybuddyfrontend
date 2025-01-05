import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api'; // Assuming api.js is configured with the base URL and interceptors

// Async actions for API calls
export const fetchBatches = createAsyncThunk('batch/fetchBatches', async (_, thunkAPI) => {
  try {
    const response = await api.get('/batches');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createBatch = createAsyncThunk('batch/createBatch', async (batchData, thunkAPI) => {
  try {
    const response = await api.post('/create-batch', batchData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateBatch = createAsyncThunk('batch/updateBatch', async ({ id, updates }, thunkAPI) => {
  try {
    const response = await api.put(`/update-batch/${id}`, updates);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const deleteBatch = createAsyncThunk('batch/deleteBatch', async ({ id, deletedBy }, thunkAPI) => {
  try {
    const response = await api.delete(`/delete-batch/${id}`, { data: { deletedBy } });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Batch Slice
const batchSlice = createSlice({
  name: 'batch',
  initialState: {
    batches: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.batches = action.payload;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBatch.fulfilled, (state, action) => {
        state.batches.push(action.payload.batch);
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        const index = state.batches.findIndex((batch) => batch._id === action.payload.batch._id);
        if (index !== -1) {
          state.batches[index] = action.payload.batch;
        }
      })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.batches = state.batches.filter((batch) => batch._id !== action.payload.batch._id);
      });
  },
});

export default batchSlice.reducer;
