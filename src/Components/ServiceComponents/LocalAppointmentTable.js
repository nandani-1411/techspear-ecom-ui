import React, { useState, useEffect } from "react";

const LocalAppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    description: "",
    category: "",
    subcategory: "",
    serviceType: "",
    status: "Pending",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDetails, setRescheduleDetails] = useState({
    date: "",
    time: "",
  });

  const categories = {
    PC: ["Repair", "Upgrade", "Cleaning"],
    Laptop: ["Screen Repair", "Battery Replacement", "General Service"],
    Other: ["Custom Service 1", "Custom Service 2", "Consultation"],
  };

  // Set the current date and time when the component is first mounted
  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(" ")[0].substring(0, 5); // HH:MM

    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      date: formattedDate,
      time: formattedTime,
    }));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (name === "category") {
      setAppointmentDetails((prevDetails) => ({
        ...prevDetails,
        subcategory: "",
        serviceType: "",
      }));
    }

    if (name === "subcategory") {
      setAppointmentDetails((prevDetails) => ({
        ...prevDetails,
        serviceType: value,
      }));
    }
  };

  // Handle form submission to add new appointment
  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointments((prevAppointments) => [
      ...prevAppointments,
      { ...appointmentDetails, id: Date.now() },
    ]);
    setAppointmentDetails({
      name: "",
      email: "",
      date: "",
      time: "",
      description: "",
      category: "",
      subcategory: "",
      serviceType: "",
      status: "Pending",
    });
  };

  // Handle Reschedule Modal Open
  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDetails({
      date: appointment.date,
      time: appointment.time,
    });
    setShowRescheduleModal(true);
  };

  // Handle Reschedule Form Submission
  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === selectedAppointment.id
          ? {
            ...appointment,
            date: rescheduleDetails.date,
            time: rescheduleDetails.time,
          }
          : appointment
      )
    );
    setShowRescheduleModal(false);
  };

  // Handle status change
  const handleStatusChange = (id, status) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
  };

  // Close Reschedule Modal
  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
  };
  const handleRowClick = (appointment) => {
    if (selectedAppointment?.id === appointment.id) {
      setSelectedAppointment(null); // Deselect if clicked again
    } else {
      setSelectedAppointment(appointment); // Select the appointment
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Local Appointments
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={appointmentDetails.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={appointmentDetails.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={appointmentDetails.date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            name="time"
            value={appointmentDetails.time}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="category"
            value={appointmentDetails.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            name="subcategory"
            value={appointmentDetails.subcategory}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!appointmentDetails.category}
          >
            <option value="">Select Subcategory</option>
            {appointmentDetails.category &&
              categories[appointmentDetails.category].map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
          </select>
        </div>

        <div>
          <textarea
            name="description"
            value={appointmentDetails.description}
            onChange={handleChange}
            placeholder="Add a brief description or notes about the appointment (Optional)"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Appointment
        </button>
      </form>

      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full table-auto text-left">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-2">Appointment ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Service Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <React.Fragment key={appointment.id}>
                <tr
                  className="border-b cursor-pointer"
                  onClick={() => handleRowClick(appointment)}
                >
                  <td className="px-4 py-2">{appointment.id}</td>
                  <td className="px-4 py-2">{appointment.name}</td>
                  <td className="px-4 py-2">{appointment.date}</td>
                  <td className="px-4 py-2">{appointment.time}</td>
                  <td className="px-4 py-2">{appointment.serviceType}</td>
                  <td className="px-4 py-2">{appointment.status}</td>
                  <td className="px-4 py-2">
                    {appointment.status !== "Completed" && (
                      <>
                        <button
                          onClick={() => handleRescheduleClick(appointment)}
                          className="bg-yellow-500 text-white p-2 rounded-md"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, "Completed")}
                          className="bg-green-500 text-white p-2 rounded-md ml-2"
                        >
                          Mark as Completed
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {selectedAppointment?.id === appointment.id && (
                  <tr>
                    <td colSpan="7" className="bg-gray-100 p-4">
                      <h4 className="font-semibold">Appointment Details</h4>
                      <div>
                        <p><strong>Email:</strong> {appointment.email}</p>
                        <p><strong>Category:</strong> {appointment.category}</p>
                        <p><strong>Subcategory:</strong> {appointment.subcategory}</p>
                        <p><strong>Notes:</strong> {appointment.description}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold">Reschedule Appointment</h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <input
                type="date"
                value={rescheduleDetails.date}
                onChange={(e) => setRescheduleDetails({ ...rescheduleDetails, date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="time"
                value={rescheduleDetails.time}
                onChange={(e) => setRescheduleDetails({ ...rescheduleDetails, time: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                Reschedule
              </button>
              <button
                type="button"
                onClick={closeRescheduleModal}
                className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 mt-2"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalAppointmentTable;
