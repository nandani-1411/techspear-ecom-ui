import { useState, useEffect, useContext } from "react";
import { FaCalendarCheck, FaSearch, FaEnvelope, FaTimes, FaChevronDown } from "react-icons/fa";
import { ThemeContext } from "../../Helpers/ThemeContext"; // Ensure correct import
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllNotify, getMyService } from "../../features/serviceSlice";
import moment from "moment";
import React from "react";

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);

  const dispatch = useDispatch()

  const [myAppoinment, setMyAppoinment] = useState([])

  const getMyAppoinment = async () => {
    try {
      const res = await dispatch(getMyService()).unwrap();
      console.log("My Appoinmet History ", res?.data)
      setMyAppoinment(res?.data)
      setAppointments(res?.data)
      toast.success(res?.message)
    }
    catch (er) {
      toast.error(er)
    }
  }



  useEffect(() => {
    getMyAppoinment()

  }, [dispatch])

  const filteredAppointments = appointments.filter(
    (appointment) =>
      (filterStatus === "all" || appointment.status === filterStatus) &&
      appointment?.subCategories?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('filtered appoinmt ', filteredAppointments)
  console.log('filter len ', filteredAppointments.length)

  const openMessageModal = async (appoinment) => {
    try {
      console.log(appoinment?._id)
      const res = await dispatch(getAllNotify({ userId: appoinment?._id })).unwrap();
      console.log("My Appoinmet Notification ", res?.data)
      setAllNotifications(res?.data)
      toast.success(res?.message)


      const allMessages = res?.data || [];

      // Filter messages for the selected appointment
      const filteredMessages = allMessages.filter(
        (msg) => msg.user === appoinment?._id
      );

      setSelectedMessages(filteredMessages);

      setShowModal(true);
    }
    catch (er) {
      toast.error(er)
    }

  };
  const { isDarkMode } = useContext(ThemeContext);

  const getNotificationCount = (id) => {
    return allNotifications.filter((msg) => msg.user === id).length;
  };



  return (
    <div className={`p-6 min-h-screen transition-all duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"}`}>
      <h2
        className={`text-2xl font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"
          }`}
      >
        <FaCalendarCheck className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
        Appointment History
      </h2>


      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search service..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 
                 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                 transition-all duration-200 shadow-sm hover:border-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-1/3">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                 transition-all duration-200 shadow-sm hover:border-gray-400 appearance-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Schedule">Schedule</option>
            <option value="ReSchedule">ReSchedule</option>
            <option value="Complete">Complete</option>
            <option value="Cancel">Cancel</option>
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {Array.isArray(filteredAppointments) && filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className={`p-5 rounded-lg shadow-lg border transition-transform transform hover:scale-[1.02] ${isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-900"
                }`}
            >
              {/* Service Title */}
              <h3 className="text-xl font-semibold">{appointment?.subCategories}</h3>

              {/* Date & Time */}
              <p
                className={`mt-1 flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                📅 {moment(appointment?.date).format("DD-MM-YYYY")} | ⏰{" "}
                {appointment?.scheduleTime}
              </p>

              {/* Description */}
              <p
                className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {appointment?.addressInfo}
              </p>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 mt-3 inline-block rounded-full text-sm font-medium shadow-sm ${appointment.status === "Complete"
                  ? isDarkMode
                    ? "bg-green-900 text-green-300"
                    : "bg-green-200 text-green-800"
                  : appointment.status === "ReSchedule"
                    ? isDarkMode
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-yellow-200 text-yellow-800"
                    : appointment.status === "Cancel"
                      ? isDarkMode
                        ? "bg-red-900 text-red-300"
                        : "bg-red-200 text-red-800"
                      : isDarkMode
                        ? "bg-blue-900 text-blue-300" // for "Schedule" and fallback
                        : "bg-blue-200 text-blue-800"
                  }`}
              >
                {appointment.status}
              </span>


              {/* View Messages Button */}
              <button
                className={`mt-3 w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition active:scale-95 ${isDarkMode
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                onClick={() => openMessageModal(appointment)}
              >
                <FaEnvelope />
                View Messages
                {appointment.messages?.length > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {appointment?.length}
                  </span>
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No appointments found.</p>
        )}
      </div>



      {/* Desktop Table */}
      <div
        className={`hidden md:block shadow-lg rounded-lg overflow-x-auto transition ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
      >
        {!Array.isArray(filteredAppointments) || filteredAppointments.length === 0 ? (
          <p className={`py-4 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            No appointments found.
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead className={isDarkMode ? "bg-gray-700 text-white" : "bg-gray-800 text-white"}>
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Messages</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredAppointments.map((appointment) => (
                <React.Fragment key={appointment._id}>
                  {/* Main Row */}
                  <tr
                    className={`cursor-pointer transition ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    onClick={() =>
                      setSelectedAppointment(
                        selectedAppointment?._id === appointment._id ? null : appointment
                      )
                    }
                  >
                    <td className="py-3 px-4">{appointment?.subCategories}</td>
                    <td className="py-3 px-4">{moment(appointment.date).format("DD-MM-YYYY")}</td>
                    <td className="py-3 px-4">{appointment?.scheduleTime}</td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 mt-3 inline-block rounded-full text-sm font-medium shadow-sm ${appointment.status === "Complete"
                          ? isDarkMode
                            ? "bg-green-900 text-green-300"
                            : "bg-green-200 text-green-800"
                          : appointment.status === "ReSchedule"
                            ? isDarkMode
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-yellow-200 text-yellow-800"
                            : appointment.status === "Cancel"
                              ? isDarkMode
                                ? "bg-red-900 text-red-300"
                                : "bg-red-200 text-red-800"
                              : isDarkMode
                                ? "bg-blue-900 text-blue-300" // for "Schedule" and fallback
                                : "bg-blue-200 text-blue-800"
                          }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Messages Button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        className={`relative flex items-center gap-2 px-3 py-1 rounded-md transition ${isDarkMode
                          ? "bg-blue-500 text-white hover:bg-blue-400"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openMessageModal(appointment);
                        }}
                      >
                        <FaEnvelope />
                        View Messages
                        {getNotificationCount(appointment?._id)?.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {getNotificationCount(appointment?._id)}
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Description Row */}
                  {selectedAppointment?._id === appointment._id && (
                    <tr className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                      <td colSpan="5" className={`p-4 border-t ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <strong>Description:</strong> {appointment?.addressInfo}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>





      {/* Message Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div
            className={`w-full max-w-md rounded-lg shadow-lg p-6 relative transition ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes size={18} />
            </button>

            {/* Modal Title */}
            <h3
              className={`text-xl font-semibold border-b pb-2 mb-4 ${isDarkMode ? "border-gray-600 text-white" : "border-gray-300 text-gray-800"
                }`}
            >
              Messages
            </h3>

            {/* Messages List */}
            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
              {selectedMessages.length > 0 ? (
                selectedMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md shadow-sm ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    <p className="text-sm text-gray-400">{msg.date}</p>
                    <p>{msg.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No messages available.</p>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
