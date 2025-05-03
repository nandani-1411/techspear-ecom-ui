import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaCamera, FaEdit } from "react-icons/fa";
import { ThemeContext } from "../../Helpers/ThemeContext";
import img from "../user_im.png";

export default function ProfilePage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ⬅️ Loading state

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/users/getCurrentUser", { withCredentials: true });
      setUser(response.data.data.user);
      setFormData(response.data.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePic: imageUrl }));

      // Upload image to backend
      uploadProfilePicture(file);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await axios.patch("http://localhost:5000/api/v1/users/updateProfilePic", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data.data);
      setPopupMessage("Profile picture updated successfully!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating profile picture:", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile update
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch("http://localhost:5000/api/v1/users/updateDetails", formData, { withCredentials: true });

      setUser(response.data.data);
      setEditMode(false);
      setPopupMessage("Your profile has been updated successfully!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  // Theme-based styles
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-gray-300";
  const cardColor = isDarkMode ? "bg-[#252A4A] text-white" : "bg-white text-gray-700";
  const inputBg = isDarkMode ? "bg-[#2F365F] text-white" : "bg-white text-gray-900";
  const inputBorder = isDarkMode ? "border-[#4A4F7C]" : "border-gray-300";
  const buttonPrimary = isDarkMode ? "bg-[#5765F2] hover:bg-[#3E4CCF]" : "bg-blue-500 hover:bg-blue-700";
  const buttonSecondary = isDarkMode ? "bg-[#3E4366] hover:bg-[#2A2F4A]" : "bg-gray-300 hover:bg-gray-400";

  if (isLoading) return <>
    <div className="text-center text-lg font-semibold">Loading...</div>
    <div className="text-center mt-6">It Take Some time For Updatation. Pls Wait.</div>
  </>;

  if (!user) return <div className="text-center">No user found.</div>;

  return (
    <div className={`h-screen w-full flex items-center justify-center ${bgColor} mb-24`}>
      <div className={`${cardColor} p-8 rounded-lg shadow-lg w-full max-w-lg relative`}>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <img src={formData.profilePic || img} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-300" />
            {editMode && (
              <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
                <FaCamera className="text-white" />
              </label>
            )}
            <input type="file" id="profile-image" className="hidden" onChange={handleImageChange} />
          </div>
          <h2 className="text-xl font-bold">Your Profile</h2>
        </div>

        <div className="mt-6 space-y-4">
          {["name", "email"].map((field, index) => (
            <div key={index} className="relative">
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`peer w-full pt-6 pl-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${inputBorder}`}
              />
              <label className="absolute left-3 top-1 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {editMode && <FaEdit className="absolute right-3 top-3 text-blue-500" />}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : editMode ? (
            <>
              <button onClick={handleSave} className={`px-6 py-2 text-white rounded-md transition-all ${buttonPrimary}`}>
                Save
              </button>
              <button onClick={handleCancel} className={`ml-4 px-6 py-2 rounded-md transition-all ${buttonSecondary}`}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-all">
              Edit Profile
            </button>
          )}
        </div>

        <p className="text-sm mt-4 text-center">Last updated: {new Date(user.updatedAt).toLocaleString()}</p>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${cardColor} p-6 rounded-lg shadow-lg`}>
            <p className="text-lg font-semibold">{popupMessage}</p>
            <button onClick={() => setShowPopup(false)} className={`mt-4 px-6 py-2 text-white rounded-md transition-all ${buttonPrimary}`}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
