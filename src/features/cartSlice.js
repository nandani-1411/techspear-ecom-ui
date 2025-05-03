import {createSlice ,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios";

export const addToCartProduct = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            const token=localStorage.getItem("token")
            const response = await axios.post(
                `http://localhost:5000/api/v1/cart/addToCart`,
                { userId, productId, quantity },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                         "Authorization": `Bearer ${token}`
                    },
                }
            );

            // console.log("Sending data :", { userId, productId, quantity });
            // console.log("Response:", response.data);

            return response.data;
        } catch (error) {
            console.error("Error in addToCartProduct:", error);

            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong while adding to cart."
            );
        }
    }
);

export const getCart = createAsyncThunk("cart/getCart",async (userId,{rejectWithValue})=>{
    try{
        const token=localStorage.getItem("token")
        const response = await axios.get(`http://localhost:5000/api/v1/cart/getCartItems/${userId}`,{withCredentials:true,headers:{
            "Content-Type":"application/json",
             "Authorization": `Bearer ${token}`
        }})

        return response.data;
    }catch(er){
        return rejectWithValue(er?.response?.data?.message);
    }
}) 

export const clearCart = createAsyncThunk("cart/clearCart",async ({userId},{rejectWithValue})=>{
    try{
        const token=localStorage.getItem("token")
        console.log(userId)
        ///clearCart
        const response = await axios.patch(`http://localhost:5000/api/v1/cart/clearCart/${userId}`,{},
            {withCredentials:true,headers:{
            "Content-Type":"application/json",
             "Authorization": `Bearer ${token}`
        }})

        return response.data;
    }catch(er){
        return rejectWithValue(er?.response?.data?.message);
    }
}) 


export const updateCartQuntity = createAsyncThunk("cart/updateCartQuntity",async ({userId,productId,quantity},{rejectWithValue})=>{
    try{
        const token= localStorage.getItem("token")
        const response = await axios.patch(`http://localhost:5000/api/v1/cart/updateQuntity`,{userId,productId,quantity},{withCredentials:true,headers:{
            "Content-Type":"application/json",
             "Authorization": `Bearer ${token}`
        }})
        console.log({userId,productId,quantity})

        return response.data;
    }catch(er){
        console.log(er)
        return rejectWithValue(er?.response?.data?.message); 
    }
})

export const delteCartItem = createAsyncThunk("cart/delteCartItem",async ({userId,productId})=>{
    try{
        const token= localStorage.getItem("token")
        const response = await axios.delete(`http://localhost:5000/api/v1/cart//deleteCartItem/${userId}/${productId}`,{withCredentials:true,headers:{
            "Content-Type":"application/json",
             "Authorization": `Bearer ${token}`
        }})
        console.log("id",{userId,productId})

        return response.data;
    }catch(er){
        return er?.response?.data?.message;
    }
})

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        cartItems:[],
        loading:false,
        error:null
    },
    extraReducers:(builder)=>{

        builder.addCase(addToCartProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        builder.addCase(addToCartProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.cartItems=action.payload;
            state.error=null;
        })
        builder.addCase(addToCartProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })

        builder.addCase(updateCartQuntity.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        builder.addCase(updateCartQuntity.fulfilled,(state,action)=>{
            state.loading=false;
            state.cartItems=action.payload;
            state.error=null;
        })
        builder.addCase(updateCartQuntity.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })

        builder.addCase(getCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        builder.addCase(getCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cartItems=action.payload;
            state.error=null;
        })
        builder.addCase(getCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })

        builder.addCase(clearCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        builder.addCase(clearCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cartItems=[];
            state.error=null;
        })
        builder.addCase(clearCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })

        builder.addCase(delteCartItem.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        builder.addCase(delteCartItem.fulfilled,(state,action)=>{
            state.loading=false;
            state.cartItems=action.payload
            state.error=null;
        })
        builder.addCase(delteCartItem.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })



    }
})

export default cartSlice.reducer;