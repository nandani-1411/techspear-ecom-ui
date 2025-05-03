import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FaLaptop, FaDesktop, FaWrench } from 'react-icons/fa'; // Using react-icons for PC and Laptop icons
import serviceImage from './ServiceBg.png'; // Background image
import { AiOutlineCheckCircle } from 'react-icons/ai'; // Success icon
import { ThemeContext } from "../Helpers/ThemeContext";
import { useDispatch, useSelector } from 'react-redux';
import { createUserService } from '../features/serviceSlice';
import { toast } from 'react-toastify';
import { getServiceByCategory } from '../features/serviceSlice';

function UserBooking() {
  const { isAuthenticate, user } = useSelector((state) => state.auth)

  let userName = user?.data?.user?.name;
  let userEmail = user?.data?.user?.email;
  // console.log(userName)
  // console.log(userEmail)

  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState(''); // Default logged-in user name
  const [email, setEmail] = useState(''); // Default logged-in user email
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [allSub, setAllSub] = useState([])

  const dispatch = useDispatch();


  useEffect(() => {
    setName(userName)
    setEmail(userEmail)
  })

  const showServiceByCategory = async (categoryName) => {
    try {
      if (!isAuthenticate) {
        return toast.error("Login first to explore our services.")
      }

      console.log("Selcted Category ", categoryName)
      const rs = await dispatch(getServiceByCategory({ name: categoryName })).unwrap();
      console.log(rs?.data);
      setAllSub(rs?.data);
      toast.success(rs?.message)
    }
    catch (er) {
      console.log(er);
      toast.error(er)
    }
  }

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    showServiceByCategory(service)
    console.log(allSub)
    setSelectedCategory(''); // Reset category when a new service is selected
    setBookingSuccess(false); // Reset success message when selecting a new service
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (!isAuthenticate) {
        return toast.error("Please Login to Access of Service.")
      }

      const rs = await dispatch(createUserService({
        categoryName: selectedService,
        name: userName,
        email: userEmail,
        addressInfo: additionalDetails,
        scheduleTime: timeSlot,
        date: bookingDate,
        subCategories: selectedCategory
      })).unwrap()
      setBookingSuccess(true); // Set booking as successful
      toast.success(rs?.message)
    } catch (er) {
      console.log('er')
      toast.error(er)
    }

  };

  const handleBackToSelection = () => {
    setBookingSuccess(false); // Reset success state when going back to service selection
    setSelectedService(null); // Reset selected service
  };

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <main
        className={`p-3 bg-cover bg-center text-white relative ${isDarkMode ? "bg-black/60" : "bg-white/80"
          }`}
        style={{
          backgroundImage: `url(${serviceImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh', // Ensuring it covers full screen height
        }}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {bookingSuccess ? (
            <div
              className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
                } bg-opacity-80 shadow-2xl rounded-lg p-6 mt-8 text-center`}
            >
              <AiOutlineCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
              <h3 className="text-2xl font-semibold">Booking Confirmed!</h3>
              <p className="mt-4 text-lg">
                Your {selectedService} booking has been successfully confirmed. The admin
                will notify you with the final date and time for your appointment.
              </p>
              <div className="mt-6">
                <h4 className="font-medium">Service Details:</h4>
                <p>
                  <strong>Category:</strong> {selectedCategory || "N/A"}
                </p>
                <p>
                  <strong>Booking Date:</strong> {bookingDate || "N/A"}
                </p>
                <p>
                  <strong>Time Slot:</strong> {timeSlot || "N/A"}
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleBackToSelection}
                  className={`py-2 px-6 rounded-full transition font-semibold ${isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                  Go Back to Service Selection
                </button>
              </div>
              <div className={`mt-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                You will be notified by the admin with further details soon.
              </div>
            </div>
          ) : selectedService === null ? (
            <>
              <h2 className="text-3xl font-semibold text-center text-black">Select a Service</h2>
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 
  ${isDarkMode ? "text-white" : "text-black"}`}>

                {/* Laptop Services Card */}
                <div
                  className={`shadow-lg rounded-lg p-6 text-center cursor-pointer hover:shadow-xl sm:w-full lg:w-64 transition 
      ${isDarkMode ? "bg-gray-800 text-white" : "bg-white bg-opacity-70 text-black"}`}
                  onClick={() => handleServiceSelection('Laptop')}
                >
                  <FaLaptop className="mx-auto h-16 w-16 mb-4" />
                  <h3 className="text-xl font-semibold">Laptop Services</h3>
                </div>

                {/* PC Services Card */}
                <div
                  className={`shadow-lg rounded-lg p-6 text-center cursor-pointer hover:shadow-xl sm:w-full lg:w-64 transition 
      ${isDarkMode ? "bg-gray-800 text-white" : "bg-white bg-opacity-70 text-black"}`}
                  onClick={() => handleServiceSelection('PC')}
                >
                  <FaDesktop className="mx-auto h-16 w-16 mb-4" />
                  <h3 className="text-xl font-semibold">PC Services</h3>
                </div>

                {/* Other Services Card */}
                <div
                  className={`shadow-lg rounded-lg p-6 text-center cursor-pointer hover:shadow-xl sm:w-full lg:w-64 transition 
      ${isDarkMode ? "bg-gray-800 text-white" : "bg-white bg-opacity-70 text-black"}`}
                  onClick={() => handleServiceSelection('Other')}
                >
                  <FaWrench className="mx-auto h-16 w-16 mb-4" />
                  <h3 className="text-xl font-semibold">Other Services</h3>
                </div>

              </div>

              <div
                className={`p-6 rounded-lg mt-8 transition ${isDarkMode ? "bg-gray-800 text-white" : "bg-white bg-opacity-80 text-black"
                  }`}
              >
                <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-black"}`}>
                  Booking Information
                </h3>
                <p className={`mt-4 text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                  <strong>Laptop Services:</strong> Need a repair, upgrade, or setup for your laptop? Book an appointment, and we’ll schedule a time for you. Make sure to visit our store at the confirmed time to get your service done.
                </p>
                <p className={`mt-4 text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                  <strong>PC Services:</strong> If your desktop needs troubleshooting, hardware upgrades, or software installation, schedule a service with us. Once booked, we’ll provide a time slot—just bring your PC to our store at that time.
                </p>
                <p className={`mt-4 text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                  <strong>Other Services:</strong> For custom PC builds, data recovery, virus removal, or any other tech issues, book an appointment. We’ll let you know when to visit, so you can get the help you need without the wait.
                </p>
                <p className={`mt-4 text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                  If you have any questions or need more details, feel free to
                  <a href="/contact-us" className="text-blue-500 font-semibold text-base hover:no-underline"> contact us</a>  .
                  We’re happy to help!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <button
                  className="flex items-center underline text-black"
                  onClick={() => setSelectedService(null)} // Go back to service selection
                >
                  <ArrowLeftIcon className="h-7 w-9 mr-2" />
                </button>
              </div>

              <h2 className="text-3xl font-semibold text-center text-black">Book Your {selectedService}</h2>

              <div
                className={`p-6 mt-8 shadow-lg rounded-lg transition ${isDarkMode
                  ? "bg-gray-900 bg-opacity-80 text-white border-gray-500"
                  : "bg-white bg-opacity-80 text-black border-gray-300"
                  }`}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className={`w-full p-3 border rounded-lg sm:text-sm transition ${isDarkMode ? "bg-gray-800 text-white border-gray-500" : "bg-white text-black border-gray-300"
                        }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium">Your Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full p-3 border rounded-lg transition ${isDarkMode ? "bg-gray-800 text-white border-gray-500" : "bg-white text-black border-gray-300"
                        }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium">Select Category</label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full p-3 border rounded-lg sm:text-sm transition ${isDarkMode ? "bg-gray-800 text-white border-gray-500" : "bg-white text-black border-gray-300"
                        }`}
                      required
                    >
                      <option value="">Select Category</option>
                      {
                        allSub
                          ?.find((item) => item.name === selectedService)
                          ?.subCategories
                          ?.map((subCat, index) => (
                            <option key={index} value={subCat}>
                              {subCat}
                            </option>
                          ))
                      }
                    </select>
                  </div>

                  {selectedService && (
                    <div>
                      <label htmlFor="additionalDetails" className="block text-sm font-medium">Additional Information</label>
                      <textarea
                        id="additionalDetails"
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value)}
                        placeholder="Provide additional information about your request"
                        className={`w-full p-3 border rounded-lg sm:text-sm transition ${isDarkMode ? "bg-gray-800 text-white border-gray-500" : "bg-white text-black border-gray-300"
                          }`}
                        rows="4"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="bookingDate" className="block text-sm font-medium">
                      Select Booking Date
                    </label>
                    <input
                      id="bookingDate"
                      type="date"
                      min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // sets minimum date to tomorrow
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className={`w-full p-3 border rounded-lg transition ${isDarkMode
                          ? "bg-gray-800 text-white border-gray-500"
                          : "bg-white text-black border-gray-300"
                        }`}
                      required
                    />
                  </div>


                  <div>
                    <label htmlFor="timeSlot" className="block text-sm font-medium">Select Time Slot</label>
                    <select
                      id="timeSlot"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className={`w-full p-3 border rounded-lg transition ${isDarkMode ? "bg-gray-800 text-white border-gray-500" : "bg-white text-black border-gray-300"
                        }`}
                      required
                    >
                      <option value="">Choose a Time Slot</option>
                      <option value="9-11">9:00 AM - 11:00 AM</option>
                      <option value="11-1">11:00 AM - 1:00 PM</option>
                      <option value="1-3">1:00 PM - 3:00 PM</option>
                    </select>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="py-2 px-6 rounded-full transition font-semibold text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserBooking;
