import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:5000/api/v1/orders"

export const createOrder = createAsyncThunk("order/createOrder", async ({ userId, addressInfo, cartItems }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw Error("Pls Login")
        }
        console.log('slice')
        console.log(userId, addressInfo, cartItems)
        const response =await axios.post(`${baseUrl}/newOrder`, { userId, addressInfo, cartItems },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        )

        console.log(response.data)
        return response.data

    }
    catch (er) {
        return rejectWithValue(er?.response?.data?.message)
    }
})

//get all order admin side
export const getAllOrder = createAsyncThunk("order/getAll", async (__,{ rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw Error("Pls Login")
        }
        const response =await axios.get(`${baseUrl}/getAllOrders`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        )

        console.log(response.data)
        return response.data

    }
    catch (er) {
        return rejectWithValue(er?.response?.data?.message)
    }
})

//get the loggedin user k Orders
export const getMyOrdersLoggInUser = createAsyncThunk("order/loggedinUser", async (_,{ rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw Error("Pls Login")
        }
        const response =await axios.get(`${baseUrl}/getMyOrder`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        )
        console.log(response.data)
        return response.data
    }
    catch (er) {
        return rejectWithValue(er?.response?.data?.message)
    }
})

//get singleUSer ka Order -admin can see that order -find by the orderId
export const getSingleOrder = createAsyncThunk("order/singleordr",async({id},{rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token")
        if(!token) {
            throw Error("Pls Login")
        }
        console.log(id)
        const response = axios.post(`${baseUrl}/getSingleOrder/${id}`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
                },
            }
        )

        console.log(response.data)
        return response.data

    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message)
    }
})

//for the admin "only admin can chnage the status"
export const updateOrderStatus=createAsyncThunk("order/updateOrdrStatus",async({orderId,orderStatus},{rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token")
        if(!token) {
            throw Error("Pls Login")
        }
        console.log(orderId,orderStatus)
        const response =await axios.patch(`${baseUrl}/updateOrderStatus/${orderId}`,{orderStatus},
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
                },
            }
        )

        console.log(response.data)
        return response.data

    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message)
    }
})

//delete Order 
export const deleteOrder = createAsyncThunk("order/dltOrder",async({id},{rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token")
        if(!token) {
            throw Error("Pls Login")
        }
        console.log(id)
        const response = axios.post(`${baseUrl}/dltOrder/${id}`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
                },
            }
        )

        console.log(response.data)
        return response.data

    }
    catch(er){
        return rejectWithValue(er?.response?.data?.message)
    }
})


export const trackingUserOrder = createAsyncThunk("order/track",async({id},{rejectWithValue})=>{
    try {
        let token = localStorage.getItem("token")

        console.log(id)
        const response = await axios.get(`${baseUrl}/trackOrder/${id}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        return response?.data;

    } catch (error) {
        rejectWithValue(error?.response?.data?.message)
    }
})

const orderSlice = createSlice({
    name: "order",
    initialState: {
        loading: false,
        order: null,
        trackOrder:null,
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(createOrder.pending,(state,action)=>{
            state.pending=true;
            state.order=null;
            state.error=null;
        })
        builder.addCase(createOrder.fulfilled,(state,action)=>{
            state.pending=false;
            state.order=action.payload;
            state.error= null;
        })
        builder.addCase(createOrder.rejected,(state,action)=>{
            state.pending=false;
            state.error=action.payload;
        })

        builder.addCase(updateOrderStatus.pending,(state,action)=>{
            state.pending=true;
            state.order=null;
            state.error=null;
        })
        builder.addCase(updateOrderStatus.fulfilled,(state,action)=>{
            state.pending=false;
            state.order=action.payload;
            state.error= null;
        })
        builder.addCase(updateOrderStatus.rejected,(state,action)=>{
            state.pending=false;
            state.error=action.payload;
        })


        builder.addCase(getAllOrder.pending,(state,action)=>{
            state.pending=true;
            state.order=null;
            state.error=null;
        })
        builder.addCase(getAllOrder.fulfilled,(state,action)=>{
            state.pending=false;
            state.order=action.payload;
            state.error= null;
        })
        builder.addCase(getAllOrder.rejected,(state,action)=>{
            state.pending=false;
            state.error=action.payload;
        })

        builder.addCase(getSingleOrder.pending,(state,action)=>{
            state.pending=true;
            state.order=null;
            state.error=null;
        })
        builder.addCase(getSingleOrder.fulfilled,(state,action)=>{
            state.pending=false;
            state.order=action.payload;
            state.error= null;
        })
        builder.addCase(getSingleOrder.rejected,(state,action)=>{
            state.pending=false;
            state.error=action.payload;
        })

        builder.addCase(getMyOrdersLoggInUser.pending,(state,action)=>{
            state.pending=true;
            state.order=null;
            state.error=null;
        })
        builder.addCase(getMyOrdersLoggInUser.fulfilled,(state,action)=>{
            state.pending=false;
            state.order=action.payload;
            state.error= null;
        })
        builder.addCase(getMyOrdersLoggInUser.rejected,(state,action)=>{
            state.pending=false;
            state.error=action.payload;
        })


        builder.addCase(deleteOrder.pending,(state,action)=>{
            state.pending=true;
            state.order=null;
            state.error=null;
        })
        builder.addCase(deleteOrder.fulfilled,(state,action)=>{
            state.pending=false;
            state.order=action.payload;
            state.error= null;
        })
        builder.addCase(deleteOrder.rejected,(state,action)=>{
            state.pending=false;
            state.error=action.payload;
        })


        
        builder.addCase(trackingUserOrder.pending,(state,action)=>{
            state.pending=true;
            state.trackOrder=null;
            state.error=null;
        })
        builder.addCase(trackingUserOrder.fulfilled,(state,action)=>{
            state.pending=false;
            state.trackOrder=action.payload;
            state.error= null;
        })
        builder.addCase(trackingUserOrder.rejected,(state,action)=>{
            state.pending=false;
            state.error=action.payload;
        })


    }
})


export default orderSlice.reducer