import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  const navigate=useNavigate()

  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token= localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/v1/users/getAllUser", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Important
        }
    });
      const data = await response.json();
      // console.log(data)
      // console.log('stats')
      // console.log(data?.statusCode)
      if (data?.statusCode === 400) {
        console.error("Unauthorized: Token missing or expired");
        navigate("/login") // Redirect to login
        return;
    }
      if (!response.ok) throw new Error(data.message || "Failed to fetch users");

      // Ensure data is an array and remove admin users
      const users = Array.isArray(data.data) ? data.data.filter((d) => d.role !== "Admin") : [];
      setAllUsers(users);
      toast.success(data?.message)
    } catch (error) {
      toast.error(error.message);
      setAllUsers([]); // Ensure state is always an array
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle delete confirmation
  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  // API call to delete a user
  const confirmDelete = async () => {
    if (userToDelete) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:5000/api/v1/users/deleteUser/${userToDelete}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
       

        if (!response.ok) throw new Error(data.message || "Failed to delete user");

        setAllUsers((prevUsers) => prevUsers.filter(user => user._id !== userToDelete));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error(error.message);
      }
    }
    setShowModal(false);
  };

  // Close modal without deleting
  const cancelDelete = () => setShowModal(false);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <div className="bg-white pb-4 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Users</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-2 border">Sr.</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Created Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {allUser.length > 0 ? (
                allUser.map((el, index) => (
                  <tr key={el._id} className="hover:bg-gray-100">
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">{el.name}</td>
                    <td className="p-2 border">{el.email}</td>
                    <td className="p-2 border">{moment(el.createdAt).format("MMMM Do, YYYY")}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleDelete(el._id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex justify-between">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
