import React, { useState } from 'react';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector((state) => state)

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(data));

      console.log("Redux Response:", resultAction);

      if (loginUser.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;

        console.log(payload?.message)

        console.log("Payload:", payload);

        if (!payload || !payload?.sucess) {
          toast.error("Login failed. Please try again.");
          return;
        }

        const user = payload?.data?.user; 
        const token = payload?.data?.accessToken;
        const role= payload?.data?.user?.role;
        if(token || role){
          localStorage.setItem("token",token)
          localStorage.setItem("role",role)
        }
        const message = payload?.message || "Login successful";
        toast.success(message);

        if (!user) {
          toast.error("User data is missing in the response.");
          return;
        }

        if (user.role === "Admin") {
          navigate("/Admin-panel");
        } else if (user.role === "User") {
          navigate("/");
        }
      } else if (loginUser.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload || "Invalid Credentials";
        console.error("Redux Error:", errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };


  return (
    <section className='flex items-center justify-center min-h-screen bg-gray-900'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-600'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 border border-gray-600'>
            <FaUser className='text-gray-400 text-3xl' />
          </div>
          <h2 className='text-2xl font-semibold text-gray-300 border-b border-gray-600 pb-2'>Welcome Back</h2>
        </div>

        <form className='mt-6' onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-400'>Email</label>
            <input
              type='email'
              name='email'
              value={data.email}
              onChange={handleOnChange}
              className='w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter email'
              required
            />
          </div>

          <div className='mb-4 relative'>
            <label className='block text-gray-400'>Password</label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={data.password}
                onChange={handleOnChange}
                className='w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter password'
                required
              />
              <span className='absolute right-3 top-3 cursor-pointer text-gray-400' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className='text-right mb-4'>
            <Link to='/forgot-password' className='text-blue-400 hover:underline'>Forgot password?</Link>
          </div>

          <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all border border-gray-600'>
            {loading ? "Loading" : "Login"}
          </button>
        </form>

        <p className='text-center mt-6 text-gray-400'>
          Don't have an account?
          <Link to='/sign-up' className='text-blue-400 hover:underline ml-1'>Sign up</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
