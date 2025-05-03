import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { persistor } from "../redux/store.js";


const baseURL = "http://localhost:5000/api/v1/users"

export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);


export const loginUser = createAsyncThunk('user/login', async (data, { rejectWithValue }) => {

  try {

    const response = await axios.post(`${baseURL}/login`, data, { withCredentials: true })

    return response.data

  }
  catch (er) {
    return rejectWithValue(er.response?.data?.message)
  }

})

export const getCurrentUser = createAsyncThunk("user/getCurrUser", async ({ rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseURL}/getCurrentUser`, { withCredentials: true });

    return response.data;
  }
  catch (er) {
    return er
  }
})


export const logoutUser = createAsyncThunk("user/logout", async (_,{ rejectWithValue }) => {
    try{
      const token = localStorage.getItem("token")
      const response = await axios.post(`${baseURL}/logout`,{},{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      })
      localStorage.removeItem("token");
      localStorage.removeItem("user");
     

      console.log(response.data)
      return response.data;
    }
    catch(er){
      return rejectWithValue(er?.response?.data?.message)
    }
})

export const updatePassword = createAsyncThunk("user/updatePass", async ({ oldPassword, newPassword }, { rejectWithValue }) => {

  try {
    console.log({ oldPassword, newPassword })
    const response = await axios.patch(`${baseURL}/updatePass`, { oldPassword, newPassword }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })

    return response.data

  } catch (error) {
    return rejectWithValue(error?.response?.data?.message);
  }

})



export const sendOtp = createAsyncThunk("user/sendOtp", async ({ email }, { rejectWithValue }) => {

  try {
  console.log(email)
    const response = await axios.post(`http://localhost:5000/api/v1/forgetPass/sendOtp`, {email}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })
    console.log(response?.data)

    return response?.data

  } catch (error) {
    return rejectWithValue(error?.response?.data?.message);
  }
})

export const verifyOtp = createAsyncThunk("user/verifyOtp", async ({ email ,otp}, { rejectWithValue }) => {

  try {
    console.log(email,otp)
    const response = await axios.post(`http://localhost:5000/api/v1/forgetPass/verifyOtp`, {email,otp}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })

    return response.data

  } catch (error) {
    return rejectWithValue(error?.response?.data?.message);
  }
})

export const resetPass = createAsyncThunk("user/resetPass", async ({ email,newPassword }, { rejectWithValue }) => {

  try {
    const response = await axios.post(`http://localhost:5000/api/v1/forgetPass/resetPass`, {email,newPassword}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })

    return response.data

  } catch (error) {
    return rejectWithValue(error?.response?.data?.message);
  }
})

const userSlice = createSlice({
  name: "userKaAuth",
  initialState: {
    user: null,
    error: null,
    loading: false,
    isAuthenticate: false,
    otpSend:false,
    otpVerifed:false,
    passwordReset:false
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticate = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("User Registered Successfully:", action.payload);
        state.user = action.payload;
        state.isAuthenticate = false
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        //   console.error("Register Error:", action.payload);
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticate = false
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
        state.isAuthenticate = false

      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isAuthenticate = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticate = false

      });

    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
        state.isAuthenticate = false
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticate = true
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });


      builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
        state.isAuthenticate = false
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticate = false
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });

      builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.otpSend=true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.otpVerifed=true
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    builder
      .addCase(resetPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.passwordReset=true;
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    


  },
});

export default userSlice.reducer;

