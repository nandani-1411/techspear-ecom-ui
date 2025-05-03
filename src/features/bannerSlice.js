import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:5000/api/v1"


export const addBanner = createAsyncThunk("banner/add", async (formData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${baseUrl}/banner/addBanner`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message);
    }
});

export const getAllBanners = createAsyncThunk("banner/get", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${baseUrl}/banner/getBanner`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message);
    }
});

export const deleteBanner = createAsyncThunk("banner/delete", async (bannerId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.delete(`${baseUrl}/banner/deleteBanner/${bannerId}`, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message);
    }
});

const bannerSlice = createSlice({
    name: "banner",
    initialState: {
        loading: false,
        banners: [],
        error: null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(addBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(addBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners=action.payload;
            })
            .addCase(addBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getAllBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(getAllBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

 
            .addCase(deleteBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners=action.payload;
            })
            .addCase(deleteBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default bannerSlice.reducer;
