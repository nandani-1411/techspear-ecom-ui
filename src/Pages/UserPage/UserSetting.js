import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Correct import
import { ThemeContext } from "../../Helpers/ThemeContext";
import { FaBell, FaCog, FaLock } from "react-icons/fa";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { getAddress, updateAddress } from "../../features/addressSlice";
import { updatePassword } from "../../features/userSlice";


export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch()

  const [formData, setFormData] = useState({});

  const { user } = useSelector((state) => state.auth);
  const { address } = useSelector((state) => state.address);
  const userAddress = address?.data;

  const userId = user?.data?.user?._id;
  const addressId = userAddress?._id; // Get the address ID

  // Fetch address on mount
  useEffect(() => {
    if (userId) {
      dispatch(getAddress({ userId }));
    }
  }, [dispatch, userId]);

  // Populate state when data is available
  useEffect(() => {
    if (userAddress) {
      setFormData({
        fullAddress: userAddress.fullAddress,
        apartment: userAddress.apartment,
        city: userAddress.city,
        country: userAddress.country,
        pinCode: userAddress.pinCode,
        phone: userAddress.phone,
        state: userAddress.state,
      });
    }
  }, [userAddress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  // Handle update request
  const handleUpdate = async () => {
    if (!userId || !addressId) return;
    try {
      const res = await dispatch(updateAddress({ formData, userId, addressId }));
      // console.log(res)
      toast.success(res?.payload?.message)
      // toast.success("Address updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update address.");
    }
  };


  return (
    <div className={`p-6 min-h-screen mb-32 transition-all ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-900"}`}>
      <ToastContainer position="top-right" autoClose={3000} theme={isDarkMode ? "dark" : "light"} />

      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
        <FaCog /> Settings
      </h2>

      <SettingsSection title="Account">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </SettingsSection>

      <SettingsSection title="Update Address">
        {userAddress ? (
          <div className="flex flex-col gap-4 transition-all">

            {/* fullAddress */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Address</label>
              <input
                type="text"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border p-2 rounded-md w-full   ${isEditing
                    ? isDarkMode
                      ? "bg-gray-700 text-white border-gray-500"
                      : "bg-white text-black border-gray-300"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              />
            </div>

            {/* Apartment */}
            <div>
              <label className="block text-sm font-medium mb-1">Apartment</label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border p-2 rounded-md w-full   ${isEditing
                    ? isDarkMode
                      ? "bg-gray-700 text-white border-gray-500"
                      : "bg-white text-black border-gray-300"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border p-2 rounded-md w-full transition-all duration-200 outline-none
              ${isEditing
                    ? isDarkMode
                      ? "bg-gray-700 text-white border-gray-500"
                      : "bg-white text-black border-gray-300"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              />

            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border p-2 rounded-md w-full   ${isEditing
                    ? isDarkMode
                      ? "bg-gray-700 text-white border-gray-500"
                      : "bg-white text-black border-gray-300"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium mb-1">Pincode</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border p-2 rounded-md w-full   ${isEditing
                    ? isDarkMode
                      ? "bg-gray-700 text-white border-gray-500"
                      : "bg-white text-black border-gray-300"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border p-2 rounded-md w-full   ${isEditing
                    ? isDarkMode
                      ? "bg-gray-700 text-white border-gray-500"
                      : "bg-white text-black border-gray-300"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing}
                className={`border p-2 rounded-md w-full   ${isEditing
                    ? isDarkMode
                      ? "bg-gray-700 text-white border-gray-500"
                      : "bg-white text-black border-gray-300"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {!isEditing ? (
                <button className="p-2 border rounded-md bg-blue-500 text-white" onClick={() => setIsEditing(true)}>
                  Update
                </button>
              ) : (
                <button className="p-2 border rounded-md bg-green-500 text-white" onClick={handleUpdate}>
                  Save
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>No address found.</p>
        )}
      </SettingsSection>

      <SettingsSection title="System Preferences" icon={<FaCog />}>
        <ToggleOption label="Dark Mode" value={isDarkMode} onChange={toggleTheme} />
      </SettingsSection>

      <SettingsSection title="Change Password" icon={<FaLock />}>
        <ChangePasswordForm />
      </SettingsSection>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} onConfirm={() => toast.success("Account deleted permanently")} />
      )}
    </div>
  );
}

function SettingsSection({ title, icon, children }) {
  const { isDarkMode } = useContext(ThemeContext); // ✅ Fix: Access `isDarkMode` here
  return (
    <div className={`p-6 rounded-xl border shadow-md mb-6 transition-all 
        ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"}`}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
function ToggleOption({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border shadow-sm 
        bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
      <span>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={value} onChange={() => onChange(!value)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
            rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
            after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
            peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}

function ChangePasswordForm() {
  const { isDarkMode } = useContext(ThemeContext); // ✅ Fix: Access `isDarkMode` here
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch= useDispatch()

  // console.log({oldPassword,newPassword})


  const handleChangePassword = async() => {
    if (!oldPassword) {
      toast.error("Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Pls Enter New passwords and Confirm Pass same.");
      return;
    }

    try{
      const res= await dispatch(updatePassword({oldPassword,newPassword})).unwrap()
      toast.success(res?.message)
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    }
    catch(er){
      console.log(er)
      toast.error(er)
    }

   
  };

  return (
    <div className="flex flex-col gap-4">
       {/* Old Password Input */}
       <div className="relative">
        <input
          type={showOldPassword ? "text" : "password"}
          placeholder="Current Password"
          className={`w-full p-2 border rounded-md transition-all pr-10 ${
            isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
          }`}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={() => setShowOldPassword(!showOldPassword)}
        >
          {showOldPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>

      {/* New Password Input */}
      <div className="relative">
        <input
          type={showNewPassword ? "text" : "password"}
          placeholder="New Password"
          className={`w-full p-2 border rounded-md transition-all pr-10 ${
            isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
          }`}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>

      {/* Confirm Password Input */}
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          className={`w-full p-2 border rounded-md transition-all pr-10 ${
            isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
          }`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        onClick={handleChangePassword}
      >
        Change Password
      </button>
    </div>
  );
}

function DeleteAccountModal({ onClose, onConfirm }) {
  const { isDarkMode } = useContext(ThemeContext); // ✅ Fix: Access `isDarkMode` here
  const [confirmInput, setConfirmInput] = useState("");
  const navigate = useNavigate(); // ✅ React Router Hook for Navigation

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`p-6 rounded-lg shadow-lg text-center transition-all 
          ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-900"}`}>
        <h3 className="text-xl font-semibold mb-4 text-red-600">Are you sure?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This action is permanent and cannot be undone. Type <strong>"DELETE"</strong> to confirm.
        </p>
        <input
          type="text"
          className={`p-2 border rounded-md transition-all mb-4 ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"}`}
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
          placeholder="Type DELETE"
        />
        <div className="flex justify-center gap-4">
          <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-md transition ${confirmInput === "DELETE" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            onClick={() => {
              if (confirmInput === "DELETE") {
                toast.success("Account deleted permanently!");
                setTimeout(() => {
                  onConfirm();
                  onClose();
                  navigate("/");
                }, 1000); // Delay navigation for 2 seconds
              }
            }}
            disabled={confirmInput !== "DELETE"}
          >
            Yes, Delete
          </button>

        </div>
      </div>
    </div>
  );
}
