import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import img from './user_im.png';
import { useSelector,useDispatch } from 'react-redux';
import { registerUser } from '../features/userSlice';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  const navigate = useNavigate();

  const dispatch =useDispatch();
  const { user, error, loading } = useSelector((state) => state.auth); 
  // const {user,error,loading} = useSelector((state)=>state)
  
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: null
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPic = (e) => {
    const file = e.target.files[0];
    // const reader = new FileReader();
    console.log("FILE")
    console.log(file)
    if (!file) return;
    setData((prev) => ({ ...prev, profilePic: file }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (data.password !== data.confirmPassword) {
      toast.error("Confirm password and password must be the same.");
      return;
    }
  
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("profilePic", data.profilePic);
      try {
        const resultAction = await dispatch(registerUser(formData)).unwrap();
        console.log(resultAction)

      
          toast.success(resultAction.message || "Registered successfully!");
          navigate("/login");
      
      } catch (error) {
        console.error("Registration Error:", error);
        toast.error(error || "Unexpected error.");
      }
     

  };
  
  return (
    <section className='flex items-center justify-center min-h-screen bg-gray-900'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-600 sm:my-5'>
        <div className='flex flex-col items-center'>
          <div className='w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4 border border-gray-600 overflow-hidden'>
            <img src={data.profilePic} alt='Profile' className='object-cover w-full h-full' />
          </div>
          <label className='cursor-pointer text-gray-400 text-sm'>
            Upload Photo
            <input type='file' className='hidden' onChange={handleUploadPic} />
          </label>
          <h2 className='text-2xl font-semibold text-gray-300 border-b border-gray-600 pb-2 mt-4'>Sign Up</h2>
        </div>

        <form className='mt-6' onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-400'>Name</label>
            <input
              type='text'
              name='name'
              value={data.name}
              onChange={handleOnChange}
              className='w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your name'
              required
            />
          </div>

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

          <div className='mb-4 relative'>
            <label className='block text-gray-400'>Confirm Password</label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name='confirmPassword'
                value={data.confirmPassword}
                onChange={handleOnChange}
                className='w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Confirm password'
                required
              />
              <span className='absolute right-3 top-3 cursor-pointer text-gray-400' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all border border-gray-600 flex justify-center gap-2' >
          {loading ? "Loading" : "Register Account"}
            {loading ? (
             <span className='h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
            ) : null}      
          </button>
        </form>

        <p className='text-center mt-6 text-gray-400'>
          Already have an account?
          <Link to='/login' className='text-blue-400 hover:underline ml-1'>Login</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;