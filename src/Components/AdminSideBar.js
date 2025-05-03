import React from 'react';
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutUser } from '../features/userSlice';
import { persistor } from '../redux/store';
import { useDispatch } from 'react-redux';

const AdminSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    try {
      const rs = await dispatch(logoutUser()).unwrap();
      toast.success(rs?.message);
      persistor.purge();
      window.location.reload();
      navigate('/login');
    } catch (er) {
      console.log(er);
      toast.error(er);
    }
  };

  return (
    <div className="h-full hidden md:flex sticky">
      <aside className="bg-gradient-to-r from-blue-600 to-blue-900 w-60 shadow-lg flex-shrink-0 h-screen flex flex-col">
        {/* User info */}
        <div className="h-32 flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            <FaRegCircleUser className="text-white" />
          </div>
          <p className="capitalize text-lg font-semibold text-white">Admin User</p>
        </div>

        {/* Navigation */}
        <div className="flex-grow">
          <nav className="grid p-4">
            <Link to="" className="px-2 py-1 text-white hover:bg-blue-700 hover:text-yellow-300 rounded-md mt-2">Dashboard</Link>
            <Link to="All-user" className="px-2 py-1 text-white hover:bg-blue-700 hover:text-yellow-300 rounded-md mt-3">User Management</Link>
            <Link to="All-product" className="px-2 py-1 text-white hover:bg-blue-700 hover:text-yellow-300 rounded-md mt-3">Product Management</Link>
            <Link to="Order-management" className="px-2 py-1 text-white hover:bg-blue-700 hover:text-yellow-300 rounded-md mt-3">Order Management</Link>
            <Link to="payment-management" className="px-2 py-1 text-white hover:bg-blue-700 hover:text-yellow-300 rounded-md mt-3">Payment Management</Link>
            <Link to="Service-management" className="px-2 py-1 text-white hover:bg-blue-700 hover:text-yellow-300 rounded-md mt-3">Service Management</Link>
            <Link to="banner-management" className="px-2 py-1 text-white hover:bg-blue-700 hover:text-yellow-300 rounded-md mt-3">Banner Management</Link>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 hover:text-yellow-300 rounded-md w-full"
          >
            Log Out
          </button>
        </div>
      </aside>
    </div>
  );
};

export default AdminSideBar;
