import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { FaUser, FaBox, FaHistory, FaCogs, FaCalendarCheck } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../Helpers/ThemeContext";

export default function UserSidebar() {
  const { isDarkMode } = useContext(ThemeContext);

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const hoverColor = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-300";
  const borderColor = isDarkMode ? "border-r border-gray-700" : "border-r border-gray-300";

  return (
    <aside className={`${bgColor} ${textColor} ${borderColor} h-screen p-4 transition-all duration-300 w-16 lg:w-64 flex flex-col space-y-4`}>
      <nav className="space-y-4">
        <SidebarLink to="" icon={<FaUser size={24} />} label="User Profile" tooltipId="userProfile" hoverColor={hoverColor} />
        <SidebarLink to="order-manage" icon={<FaBox size={24} />} label="Order History" tooltipId="orderHistory" hoverColor={hoverColor} />
        <SidebarLink to="Appointment-history" icon={<FaCalendarCheck size={24} />} label="Your Appointments" tooltipId="appointmentHistory" hoverColor={hoverColor} />
        <SidebarLink to="Payment-history" icon={<FaHistory size={24} />} label="Transaction History" tooltipId="transactionHistory" hoverColor={hoverColor} />
        <SidebarLink to="User-Setting" icon={<FaCogs size={24} />} label="Settings" tooltipId="settings" hoverColor={hoverColor} />
      </nav>

      {/* React Tooltips */}
      <Tooltip id="userProfile" place="bottom" content="User Profile" />
      <Tooltip id="orderHistory" place="bottom" content="Order History" />
      <Tooltip id="appointmentHistory" place="bottom" content="Your Appointments" />
      <Tooltip id="transactionHistory" place="bottom" content="Transaction History" />
      <Tooltip id="settings" place="bottom" content="Settings" />
    </aside>
  );
}

// Sidebar Link Component
const SidebarLink = ({ to, icon, label, tooltipId, hoverColor }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${hoverColor}`}
      data-tooltip-id={tooltipId}
    >
      {icon}
      <span className="hidden lg:inline ml-4">{label}</span>
    </Link>
  );
};
