import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl= "http://localhost:5000/api/v1/address"

export const addAddress = createAsyncThunk("address/add", async ({userId,formData},{ rejectWithValue }) => {
    try{
        const token= localStorage.getItem("token")
        const response= await axios.post(`${baseUrl}/addAddress`,{userId,...formData}, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                 "Authorization": `Bearer ${token}`
            },
        })
        console.log({userId,formData})
        console.log(response.data)
        return response.data
    }
    catch(er){
        rejectWithValue(er?.response?.data?.message)
    }
})

export const updateAddress = createAsyncThunk("address/update",async({formData,userId,addressId},{rejectWithValue})=>{
    try {
        const token=localStorage.getItem("token")
        const response= await axios.patch(`${baseUrl}/updateAddress/${userId}/${addressId}`,formData,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        return response.data
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message)
    }
})

export const deleteAddress = createAsyncThunk("address/delAdd",async({userId,addressId},{rejectWithValue})=>{
    try {
        const token= localStorage.getItem("token")
        const response= await axios.delete(`${baseUrl}/deleteAddress/${userId}/${addressId}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        rejectWithValue(error?.response?.data?.message)
    }
})

export const getAddress = createAsyncThunk("address/getAdd",async({userId},{rejectWithValue})=>{
    try {
        const token= localStorage.getItem("token")
        const response= await axios.get(`${baseUrl}/getAddress/${userId}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        console.log(userId)
        console.log(response.data)

        return response.data
    } catch (error) {
        console.log(error)
       return rejectWithValue(error?.response?.data?.message)
    }
})

const addressSlice = createSlice({
    name: "address",
    initialState: {
        loading: false,
        address: null,
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(addAddress.pending,(state,action)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(addAddress.fulfilled,(state,action)=>{
            state.loading=false;
            state.address=action.payload;
            state.error=null;
        })
        builder.addCase(addAddress.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })

        builder.addCase(updateAddress.pending,(state,action)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(updateAddress.fulfilled,(state,action)=>{
            state.loading=false;
            state.address=action.payload;
            state.error=null;
        })
        builder.addCase(updateAddress.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })

        builder.addCase(deleteAddress.pending,(state,action)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(deleteAddress.fulfilled,(state,action)=>{
            state.loading=false;
            state.address=action.payload;
            state.error=null;
        })
        builder.addCase(deleteAddress.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })

        builder.addCase(getAddress.pending,(state,action)=>{
            state.loading=true;
            state.error=null
        })
        builder.addCase(getAddress.fulfilled,(state,action)=>{
            state.loading=false;
            state.address=action.payload;
            state.error=null;
        })
        builder.addCase(getAddress.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload
        })



    }
}) 

export default addressSlice.reducer;