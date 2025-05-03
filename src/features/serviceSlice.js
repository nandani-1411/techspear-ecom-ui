import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl= "http://localhost:5000/api/v1/service";

export const createServiceCategory = createAsyncThunk("service/createCtegory",async({name,subCategories},{rejectWithValue})=>{

    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        console.log(name,subCategories)
        const response = await axios.post(`${baseUrl}/createCategories`,{name,subCategories},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response.data);
        return response.data;
    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message);
    }

})

export const getAllServiceCategory = createAsyncThunk("service/getAllCategories",async(_,{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        const response = await axios.get(`${baseUrl}/getAllCategories`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response.data);
        return response.data;
    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message);
    }

})

export const getServiceByCategory = createAsyncThunk("service/getServiceByCategory",async({name},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    console.log(name,token)
    try{
        const response = await axios.get(`${baseUrl}/gettingCategories/${name}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response.data);
        return response.data;
    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message);
    }

})

export const dltSubCategory = createAsyncThunk("service/dltSubCategory",async({name,subCategories},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        console.log(name, subCategories);
      const response = await axios.delete(`${baseUrl}/dltSubCategory`, {
        data: { name, subCategories }, 
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      return response.data;
    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message);
    }

})

export const createUserService = createAsyncThunk("service/createUserService",async({categoryName,scheduleTime,addressInfo,date,subCategories},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    console.log(categoryName)
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        // console.log(category,subCategories)
        const response = await axios.post(`${baseUrl}/createUserService/${categoryName}`,{scheduleTime,addressInfo,date,subCategories},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response.data);
        return response.data;
    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message);
    }

})

export const getAllUserService = createAsyncThunk("service/getAllUserService",async(_,{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        const response = await axios.get(`${baseUrl}/getAllServiceUser`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response.data);
        return response.data;
    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message);
    }

})

export const getMyService = createAsyncThunk("service/myservice",async(_,{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        const response= await axios.get(`${baseUrl}/getMyService`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response?.data)
        return response?.data
    }
    catch(er){
        return rejectWithValue(er?.response?.data.message)
    }
})

export const reScheduleUserService = createAsyncThunk("service/reSchedule",async({time,date,apppoinmentId},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        const response= await axios.post(`${baseUrl}/reScheduleService`,{time,date,apppoinmentId},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response?.data)
        return response?.data
    }
    catch(er){
        return rejectWithValue(er?.response?.data.message)
    }
}) 

export const cancelService = createAsyncThunk("service/cancel",async({userId},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        const response= await axios.post(`${baseUrl}/cancleService/${userId}`,{},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response?.data)
        return response?.data
    }
    catch(er){
        return rejectWithValue(er?.response?.data.message)
    }
})

export const completeServiceUser = createAsyncThunk("service/complete",async({userId},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        const response= await axios.post(`${baseUrl}/completeService/${userId}`,{},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response?.data)
        return response?.data
    }
    catch(er){
        return rejectWithValue(er?.response?.data.message)
    }
}) 


// User Notifications -----> for service RESchedul, Schedule , and Complete ,Cancel service
export const getScheduleNotify = createAsyncThunk("service/scheduleNotify",async({userId},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        const response= await axios.get(`${baseUrl}/getScheduleNotification/${userId}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response?.data)
        return response?.data
    }
    catch(er){
        return rejectWithValue(er?.response?.data.message)
    }
}) 

export const getCancelNotify = createAsyncThunk("service/cancelNotify",async({userId},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    try{
        const response= await axios.get(`${baseUrl}/getcancleNotification/${userId}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        console.log(response?.data)
        return response?.data
    }
    catch(er){
        return rejectWithValue(er?.response?.data.message)
    }
}) 

export const getAllNotify = createAsyncThunk("service/allNotify",async({userId},{rejectWithValue})=>{
    const token= localStorage.getItem("token");
    if(!token){
        throw new Error("User not Authenticated")
    }
    console.log(userId)
    try{
        const response= await axios.get(`${baseUrl}/getAllNotification/${userId}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        console.log(response?.data)
        return response?.data
    }
    catch(er){
        return rejectWithValue(er?.response?.data.message)
    }
}) 


const serviceSlice = createSlice({

    name:"Service",
    initialState:{
        loading:false,
        service:null,
        error:null
    },
    extraReducers: (builder)=>{
        builder.addCase(createServiceCategory.pending,(state,action)=>{
            state.loading=true;
            state.service=null;
            state.error=null;
        })
        builder.addCase(createServiceCategory.fulfilled,(state,action)=>{
            state.loading=false;
            state.service=action.payload;
            state.error=null;
        })
        builder.addCase(createServiceCategory.rejected,(state,action)=>{
            state.loading=false;
            state.service=null;
            state.error=action.payload
        })

        builder.addCase(getAllServiceCategory.pending,(state,action)=>{
            state.loading=true;
            state.service=null;
            state.error=null;
        })
        builder.addCase(getAllServiceCategory.fulfilled,(state,action)=>{
            state.loading=false;
            state.service=action.payload;
            state.error=null;
        })
        builder.addCase(getAllServiceCategory.rejected,(state,action)=>{
            state.loading=false;
            state.service=null;
            state.error=action.payload
        })
    }

})

export default serviceSlice.reducer;