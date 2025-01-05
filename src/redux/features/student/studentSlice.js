import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../utils/api'


// Async thunk for fetching students
export const fetchStudents = createAsyncThunk(
    "students/fetchStudents",
    async ({ page, limit, search, filter }) => {
        const response = await api.get("/students", {
            params: { page, limit, search, filter },
        });
        return response.data;
    }
);

// Async thunk for adding a student
export const addStudent = createAsyncThunk(
    "students/addStudent",
    async (studentData, { rejectWithValue }) => {
        try {
            const response = await api.post("/student", studentData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.student; // Return the newly added student
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to add student");
        }
    }
);

const studentSlice = createSlice({
    name: "students",
    initialState: {
        data: [],
        totalPages: 0,
        currentPage: 1,
        status: "idle",
        error: null,
        addStudentStatus: "idle", // Status for add student
        addStudentError: null,
    },
    reducers: {
        resetAddStudentState: (state) => {
            state.addStudentStatus = 'idle';
            state.addStudentError = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch students
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload.students;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });

        // Add student
        builder
            .addCase(addStudent.pending, (state) => {
                state.addStudentStatus = "loading";
                state.addStudentError = null;
            })
            .addCase(addStudent.fulfilled, (state, action) => {
                state.addStudentStatus = "succeeded";
                state.data.push(action.payload); // Add the new student to the list
            })
            .addCase(addStudent.rejected, (state, action) => {
                state.addStudentStatus = "failed";
                state.addStudentError = action.payload;
            });
    },
});
export const { resetAddStudentState } = studentSlice.actions;
export default studentSlice.reducer;
