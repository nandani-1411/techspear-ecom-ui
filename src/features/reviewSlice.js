import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl= "http://localhost:5000/api/v1/review"

export const createReview= createAsyncThunk("review/create",async({userId,productId,rating,comment},{rejectedWithValue})=>{
    try{

        const token= localStorage.getItem("token");

        if(!token){
            throw new Error("User not Authenticated")
        }

        console.log(userId,productId,rating,comment)

        const response = await axios.post(`${baseUrl}/addReview`,{userId,productId,rating,comment},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response.data)
        return response.data

    }
    catch(er){
        return rejectedWithValue(er?.response?.data?.message)
    }
})


export const getAllReview= createAsyncThunk("review/getAll",async(_,{rejectedWithValue})=>{
    try{

        const token= localStorage.getItem("token");
        if(!token){
            throw new Error("User not Authenticated")
        }

        const response = await axios.get(`${baseUrl}/getAllReview`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response.data)
        return response.data

    }
    catch(er){
        return rejectedWithValue(er?.response?.data?.message)
    }
})


export const deleteReview= createAsyncThunk("review/delete",async({reviewId},{rejectWithValue})=>{
    try{

        const token= localStorage.getItem("token");
        if(!token){     
            throw new Error("User not Authenticated")
        }
        console.log(reviewId)
        
        const response = await axios.delete(`${baseUrl}/deleteReview/${reviewId}`,{},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
            }
        })

        console.log(response.data)
        return response.data
    }catch(er){    
        return rejectWithValue(er?.response?.data?.message)
    }
})

export const getReviewByProductId= createAsyncThunk("review/getByProductId",async({productId},{rejectedWithValue})=>{
    try{

        console.log(productId)
        const response = await axios.get(`${baseUrl}/getUserReview/${productId}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
            }
        })

        console.log(response.data)
        return response.data

    }
    catch(er){
        return rejectedWithValue(er?.response?.data?.message)
    }
})

const reviewSlice  = createSlice({
    name:"review",
    initialState:{
        review:null,
        loading:false,
        error:null
    },
    extraReducers:(builder)=>{
        builder.addCase(createReview.pending,(state,action)=>{
            state.loading=true;
            state.review=null;
            state.error=null
        })
        builder.addCase(createReview.fulfilled,(state,action)=>{
            state.loading=false;
            state.review= action.payload;
            state.error=null
        })
        builder.addCase(createReview.rejected,(state,action)=>{
            state.loading=false;
            state.review=null;
            state.error=action.payload
        })


        builder.addCase(getAllReview.pending,(state,action)=>{
            state.loading=true;
            state.review=null;
            state.error=null
        })
        builder.addCase(getAllReview.fulfilled,(state,action)=>{
            state.loading=false;
            state.review= action.payload;
            state.error=null
        })
        builder.addCase(getAllReview.rejected,(state,action)=>{
            state.loading=false;
            state.review=null;
            state.error=action.payload
        })

        builder.addCase(getReviewByProductId.pending,(state,action)=>{
            state.loading=true;
            state.review=null;
            state.error=null
        })
        builder.addCase(getReviewByProductId.fulfilled,(state,action)=>{
            state.loading=false;
            state.review= action.payload;
            state.error=null
        })
        builder.addCase(getReviewByProductId.rejected,(state,action)=>{
            state.loading=false;
            state.review=null;
            state.error=action.payload
        })
    }
})

export default reviewSlice.reducer;