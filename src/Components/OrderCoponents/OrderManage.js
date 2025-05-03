import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder, updateOrderStatus } from "../../features/orderSlice";
import { toast } from "react-toastify";
import moment from "moment";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.order);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await dispatch(getAllOrder()).unwrap();
      toast.success(response?.message);
      setOrders(response?.data || []); // Ensure data is always an array
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error || "Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Fetch orders only once when the component mounts


  // const editTheStutus = async()=>{
  //     try{
  //         console.log(order._id)
  //         const response = await dispatch(updateTheStatus({orderId:order?._id,orderStatus:})).unwrap()
  //     }
  //     catch(er){

  //     }
  // }

  // Search & Filter functions
  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const updateTheStatus = async (id, newStatus) => {
    try {
      console.log(newStatus)
      const response = await dispatch(
        updateOrderStatus({
          orderId: id,
          orderStatus: newStatus, // Ensure it's sent as an object
        })
      ).unwrap();

      toast.success(response?.message || "Order status updated");

      // Update local state only if API request is successful
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (er) {
      toast.error(er || "Failed to update order status");
    }

    setEditingOrder(null);
  };

  // Handle order cancellation
  const handleCancelOrder = (id) => {
    setShowCancelModal(true);
    setOrderToCancel(id);
  };

  const confirmCancelOrder = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderToCancel ? { ...order, orderStatus: "Cancelled" } : order
      )
    );
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  // Filtered and searched orders
  const filteredOrders = orders.filter((order) =>
    (filterStatus === "All" || order.orderStatus === filterStatus) &&
    (order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.includes(searchQuery))
  );

  return (
    <div className="p-5 bg-slate-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Order Management</h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full md:max-w-md shadow-sm">
          <FaSearch className="text-slate-500" />
          <input
            type="text"
            placeholder="Search Order..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full ml-2 bg-transparent outline-none text-slate-700"
          />
        </div>
        <select
          className="border border-slate-300 bg-white rounded-md px-3 py-2 shadow-sm text-slate-700"

          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option>Select Status</option>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancel">Cancel</option>
        </select>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-slate-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-slate-300 bg-white rounded-md">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3 text-left border border-slate-300">Order ID</th>
                <th className="p-3 text-left border border-slate-300">Customer</th>
                <th className="p-3 text-left border border-slate-300">Date</th>
                <th className="p-3 text-left border border-slate-300">Status</th>
                <th className="p-3 text-center border border-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50">
                  <td className="p-3 border border-slate-300 text-slate-700">{order._id}</td>
                  <td className="p-3 border border-slate-300 text-slate-700">
                    {order.userId?.name || "N/A"}
                  </td>
                  <td className="p-3 border border-slate-300 text-slate-600">
                    {moment(order?.createdAt).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-3 border border-slate-300">
                    {editingOrder === order._id ? (
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateTheStatus(order._id, e.target.value)}
                        className="border border-slate-300 p-1 rounded-md text-slate-700"
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancel">Cancel</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium
                    ${order.orderStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.orderStatus === "Confirmed"
                              ? "bg-indigo-100 text-indigo-700"
                              : order.orderStatus === "Processing"
                                ? "bg-purple-100 text-purple-700"
                                : order.orderStatus === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.orderStatus === "Delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.orderStatus === "Cancel"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {order.orderStatus}
                      </span>

                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2 border border-slate-300">
                    {order.orderStatus !== "Cancel" ? (
                      <>
                        <button
                          className="border border-slate-300 px-2 py-1 rounded-md hover:bg-blue-100 transition text-blue-600"
                          onClick={() => setEditingOrder(order._id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="border border-slate-300 px-2 py-1 rounded-md hover:bg-red-100 transition text-red-600"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <span className="text-slate-400 italic">No Actions</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-3 text-slate-700">Confirm Cancellation</h3>
            <p className="text-slate-600">Are you sure you want to cancel this order?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition text-slate-700"
                onClick={() => setShowCancelModal(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={confirmCancelOrder}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
};

export default OrderManagement;
