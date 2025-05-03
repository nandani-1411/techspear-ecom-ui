import React, { useState } from 'react';
import moment from 'moment';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AppointmentTable = ({ appointments, handleRescheduleClick, handleCancel, handleComplete }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleRowClick = (appointment) => {
    if (selectedAppointment && selectedAppointment._id === appointment._id) {
      setSelectedAppointment(null);
    } else {
      setSelectedAppointment(appointment);
    }
  };

  const handleActionClick = (appointment, action) => {
    setSelectedAppointment(null);
    if (action === 'reschedule') {
      handleRescheduleClick(appointment);
    } else if (action === 'cancel') {
      appointment.status = 'Canceled';
      handleCancel(appointment._id);
    } else if (action === 'complete') {
      appointment.status = 'Completed';
      handleComplete(appointment._id);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-slate-800">Scheduled & Pending Appointments</h2>

      <table className="w-full border border-gray-300">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Appointment ID</th>
            <th className="border border-gray-300 px-4 py-2">Customer</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Time</th>
            <th className="border border-gray-300 px-4 py-2">Service Type</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <React.Fragment key={appointment._id}>
              <tr
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(appointment)}
              >
                <td className="border border-gray-300 px-4 py-2">{appointment._id}</td>
                <td className="border border-gray-300 px-4 py-2">{appointment.name}</td>
                <td className="border border-gray-300 px-4 py-2">{moment(appointment?.date).format('DD-MM-YYYY')}</td>
                <td className="border border-gray-300 px-4 py-2">{appointment.scheduleTime} PM</td>
                <td className="border border-gray-300 px-4 py-2">{appointment.subCategories}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium
                    ${appointment.status === 'Pending'
                        ? 'bg-yellow-200 text-yellow-800'
                        : appointment.status === 'Schedule'
                          ? 'bg-blue-200 text-blue-800'
                          : appointment.status === 'Complete'
                            ? 'bg-green-200 text-green-800'
                            : appointment.status === 'ReSchedule'
                              ? 'bg-purple-200 text-purple-800'
                              : 'bg-red-200 text-red-800'
                      }`}
                  >
                    {appointment.status}
                  </span>
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {['Schedule', 'ReSchedule'].includes(appointment.status) ? (
                    <div className="flex items-center space-x-4 justify-center">
                      {/* Reschedule */}
                      <div className="relative group">
                        <button
                          onClick={() => handleActionClick(appointment, 'reschedule')}
                          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                        >
                          <FaCalendarAlt />
                        </button>
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Reschedule
                        </span>
                      </div>

                      {/* Complete */}
                      <div className="relative group">
                        <button
                          onClick={() => handleActionClick(appointment, 'complete')}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                        >
                          <FaCheckCircle />
                        </button>
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Complete
                        </span>
                      </div>

                      {/* Cancel */}
                      <div className="relative group">
                        <button
                          onClick={() => handleActionClick(appointment, 'cancel')}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                        >
                          <FaTimesCircle />
                        </button>
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Cancel
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">No action available</span>
                  )}
                </td>
              </tr>

              {/* Expand Row */}
              {selectedAppointment && selectedAppointment._id === appointment._id && (
                <tr className="bg-slate-100 dark:text-slate-800 transition-colors duration-300">
                  <td colSpan="7" className="px-6 py-4 border-t border-slate-300 dark:border-slate-700">
                    <div className="bg-white dark:text-slate-900 rounded-md p-5 text-sm space-y-4 shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-semibold w-32 text-slate-700 dark:text-slate-900">User ID : </span>
                        <span>{appointment?.userId?._id}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-semibold w-32 text-slate-700 dark:text-slate-900">Name : </span>
                        <span>{appointment?.userId?.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-semibold w-32 text-slate-700 dark:text-slate-900">Email : </span>
                        <span>{appointment?.userId?.email}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-semibold w-32 text-slate-700 dark:text-slate-900">Service Requested : </span>
                        <span>{appointment?.addressInfo}</span>
                      </div>
                    </div>
                  </td>
                </tr>

              )}

            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
