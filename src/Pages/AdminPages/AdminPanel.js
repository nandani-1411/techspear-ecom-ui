import React from 'react';
import {Outlet } from 'react-router-dom';
import AdminSideBar from '../../Components/AdminSideBar';

const AdminPanel = () => {
  // Simulated user data for demonstration
  // const [user] = useState({
  //   name: "Admin User",
  //   profilePic: null, // Replace with an image URL if needed
  // });

  return (
    <div className="h-full hidden lg:flex">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen w-60 flex-shrink-0">
        <AdminSideBar />
      </div>
      {/* Main Content */}
      <main className="w-full h-full  flex-grow overflow-y-auto">
        <Outlet />
      </main>
    </div>

  );
};

export default AdminPanel;
