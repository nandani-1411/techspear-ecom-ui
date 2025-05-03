import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../../Components/UserSidebar";
import { ThemeContext } from "../../Helpers/ThemeContext"; // Adjust path as needed
import "../../App.css";

const UserPanel = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
  className={`h-screen flex transition-all duration-300 ${
    isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"
  }`}
>
  {/* Sidebar */}
  <div
    className={`h-full transition-all duration-300 ${
      isDarkMode ? "bg-gray-700" : "bg-gray-300"
    }`}
  >
    <UserSidebar />
  </div>

  {/* Main Content */}
  <main className="h-full flex-grow overflow-y-auto scrollbar-hidden scroll-smooth">
    <Outlet />
  </main>
</div>

  );
};

export default UserPanel;
