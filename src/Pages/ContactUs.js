import React, { useContext, useState } from "react";
import { ThemeContext } from "../Helpers/ThemeContext";
import { BuildingOffice2Icon, EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import clsx from "clsx";
import axios from "axios";
import { toast } from "react-toastify";

const ContactUs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "",  message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:5000/contactus",formData,{
        headers:{
          "Content-Type":"application/json"
        }
      })
      console.log(res?.data)
  
      if (res.status==200) {
        setIsSubmitted(true);
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
        toast.success(res?.data?.message)
        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <div className={clsx("relative py-12 sm:py-16 lg:py-20 transition-colors duration-300", isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-x-16">
          
          {/* Left: Contact Information */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-semibold sm:text-5xl">Get in touch</h2>
            <p className="mt-6 text-lg">Have a question or need assistance? Reach out to us, and we’ll be happy to help!</p>

            <dl className="mt-10 space-y-6 text-start">
              {[ 
                { icon: <BuildingOffice2Icon className="h-10 w-10 text-indigo-500" />, title: "Our Office", details: "545 Mavis Island, Chicago, IL 99191" },                { icon: <EnvelopeIcon className="h-10 w-10 text-indigo-500" />, title: "Email", details: <a href="mailto:hello@example.com" className="text-indigo-500 hover:text-indigo-400">hello@example.com</a> }
              ].map(({ icon, title, details }, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {icon}
                  <div>
                    <p className="font-semibold text-lg">{title}</p>
                    <p className="text-gray-600 dark:text-gray-400">{details}</p>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8">
              <InputField label="First Name" id="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
              <InputField label="Last Name" id="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
              <InputField label="Email" id="email" type="email" value={formData.email} onChange={handleChange} required className="sm:col-span-2" />
              
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={clsx(
                    "mt-2 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                    isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-md text-sm font-semibold shadow-md hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500">
                Send message
              </button>
            </div>
          </form>

          {/* Success Message Animation */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-4 rounded-lg flex items-center shadow-lg"
              >
                <CheckCircleIcon className="h-6 w-6 mr-3" />
                <p>Message sent successfully! We will reply soon through email.</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      <Footer/>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, id, type, value, onChange, className = "", required = false }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`sm:col-span-1 ${className}`}>
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={clsx(
          "mt-2 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
        )}
      />
    </div>
  );
};

export default ContactUs;
