import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:5000/api/v1/dashboard"

export const getMyDashboard = createAsyncThunk("banner/get", async (_, { rejectWithValue }) => {
    let token= localStorage.getItem("token")
    try {
        const response = await axios.get(`${baseUrl}/getDashboard`, {
            withCredentials: true,
            headers:`Bearer ${token}`
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message);
    }
});


const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        loading: false,
        data:null,
        error: null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(getMyDashboard.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getMyDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

 
    }
});

export default dashboardSlice.reducer;
