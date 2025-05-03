import React from 'react';

const RescheduleModal = ({
  showRescheduleForm,
  rescheduleData,
  setRescheduleData,
  handleRescheduleSubmit,
  setShowRescheduleForm,
}) => {
  return (
    showRescheduleForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Reschedule Appointment</h3>

          {/* Date Picker */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={rescheduleData.date}
              onChange={(e) =>
                setRescheduleData({ ...rescheduleData, date: e.target.value })
              }
              className="border p-2 w-full rounded-md"
            />
          </div>

          {/* Time Slot Dropdown */}
          <div className="mb-4">
            <label htmlFor="timeSlot" className="block text-gray-700 mb-1">
              Time Slot
            </label>
            <select
              id="timeSlot"
              value={rescheduleData.time}
              onChange={(e) =>
                setRescheduleData({ ...rescheduleData, time: e.target.value })
              }
              className="border p-2 w-full rounded-md"
              required
            >
              <option value="">Choose a Time Slot</option>
              <option value="9-11">9:00 AM - 11:00 AM</option>
              <option value="11-1">11:00 AM - 1:00 PM</option>
              <option value="1-3">1:00 PM - 3:00 PM</option>
              <option value="5-7">5:00 PM - 7:00 PM</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowRescheduleForm(false)}
              className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleRescheduleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default RescheduleModal;
