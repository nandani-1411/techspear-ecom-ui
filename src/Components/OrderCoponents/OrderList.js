import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

import { useContext } from 'react';
import { ThemeContext } from "../../Helpers/ThemeContext";

import { useEffect, useState } from 'react';
import Invoice from './Invoice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getMyOrdersLoggInUser } from '../../features/orderSlice';
import moment from 'moment';
import { Link } from 'react-router-dom';



export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  // const [statusIndex, setStatusIndex] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // To store the order for refund
  // const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [refundDescription, setRefundDescription] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundImage, setRefundImage] = useState(null);
  const [refundMethod, setRefundMethod] = useState("");

  const handleViewInvoice = (order) => {
    setSelectedOrder(order); // Set the order for invoice
    setShowInvoice(true); // Show invoice modal
  };
  const closeInvoice = () => {
    setShowInvoice(false);
    setSelectedOrder(null); // Reset selectedOrder to prevent refund modal from opening
  };

  const handleRefundClick = (order) => {
    setShowInvoice(false); // Ensure invoice modal is closed
    setSelectedOrder(order);
  };

  const { isAuthenticate, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  const closeRefundModal = () => {
    setSelectedOrder(null);
  };

  const processRefund = (order) => {
    // Update the refunded status in the orders array
    const updatedOrders = orders.map((o) =>
      o.number === order.number ? { ...o, refunded: true, status: 'Refunded' } : o
    );
    setOrders(updatedOrders);
    alert(`Refund request for order ${order.number} submitted!`);
    closeRefundModal();
  };
  const { isDarkMode } = useContext(ThemeContext);

  const getuserOrders = async () => {
    try {
      const rs = await dispatch(getMyOrdersLoggInUser()).unwrap()
      console.log(rs);
      toast.success(rs?.message);
      setOrders(rs.data)
    }
    catch (er) {
      console.log(er)
      toast.error(er)
    }
  }

  useEffect(() => {
    getuserOrders()
  }, [dispatch])

  console.log('Your orderes ', orders)
  console.log('order len ', orders?.length)

  return (
    <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-slate-200 text-black"} transition-colors duration-300 mb-32`}>
      <div className="pt-16 sm:pt-x24">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className={`text-2xl font-bold tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"} sm:text-3xl`}>
              Order history
            </h1>
            <h3 className={`text-xl mt-2 font-normal tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"} `}> Total Order : {orders?.length}</h3>
            <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Check the status of recent orders, manage returns, and discover similar products.
            </p>
          </div>

        </div>

        <div className="mt-16">
          <h2 className="sr-only">Recent orders</h2>
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
              {orders.length === 0 && (
                <p className="text-center text-gray-500">No orders found.</p>
              )}
              {orders.map((order) => (
                <div
                  key={order?._id}
                  className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >


                  <div className={`flex items-center border-b p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6 
                ${isDarkMode ? " text-gray-400 bg-gray-900" : "border-gray-400 text-black bg-white"}`}
                  >
                    <dl className="flex flex-col gap-y-4 text-sm sm:grid sm:grid-cols-4 sm:gap-x-6 sm:col-span-3 lg:col-span-2">
                      {/* Order ID - full width */}
                      <div className="flex flex-col space-y-1 sm:col-span-4">
                        <dt className="font-medium">Order Id</dt>
                        <dd
                          className="break-all cursor-pointer"
                          title="Click to copy"
                          onClick={() => {
                            if (order?._id) {
                              navigator.clipboard.writeText(order._id);
                              toast.success("Copied Order Id");
                            }
                          }}
                        >
                          {order?._id || "N/A"}
                        </dd>
                      </div>

                      {/* Date Placed */}
                      <div className="flex flex-col space-y-1">
                        <dt className="font-medium">Date placed</dt>
                        <dd className="mt-1">
                          <time dateTime={order?.createdAt}>
                            {order?.createdAt ? moment(order?.createdAt).format("DD-MM-YYYY") : "N/A"}
                          </time>
                        </dd>
                      </div>

                      {/* Total Items */}
                      <div className="flex flex-col space-y-1">
                        <dt className="font-medium">Total items</dt>
                        <dd className="font-medium">
                          {order?.orderItems?.length || 0}
                        </dd>
                      </div>

                      {/* Total Amount */}
                      <div className="flex flex-col space-y-1">
                        <dt className="font-medium">Total Amount</dt>
                        <dd className="font-medium">
                          ₹{order?.totalAmount}
                        </dd>
                      </div>
                    </dl>




                    {/* Mobile Menu (3-dots button) */}
                    <Menu as="div" className="relative flex justify-end lg:hidden ">
                      <MenuButton className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                        <EllipsisVerticalIcon aria-hidden="true" className="w-6 h-6" />
                      </MenuButton>

                      <MenuItems
                        className={`absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md shadow-lg ring-1 ring-black/5 transition 
      ${isDarkMode ? "bg-gray-900 text-white ring-gray-700" : "bg-white text-gray-700"}`}
                      >
                        <div className="py-1">
                          <MenuItem>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowInvoice(true);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                            >
                              Invoice
                            </button>
                          </MenuItem>

                          {order.status === "Delivered" && !order.refunded && (
                            <MenuItem>
                              <button
                                onClick={() => handleRefundClick(order)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-200"
                              >
                                Request Refund
                              </button>
                            </MenuItem>
                          )}
                        </div>
                      </MenuItems>
                    </Menu>


                    {/* Desktop Buttons (Invoice & Refund) */}
                    <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                      <button
                        onClick={() => handleViewInvoice(order)}
                        className="px-4 py-2 rounded-md shadow-sm transition bg-blue-500 text-white hover:bg-blue-600"
                      >
                        View Invoice
                      </button>

                      {order.status === "Delivered" && (
                        order.refunded ? (
                          <span className="text-sm font-medium text-green-600">Refunded</span>
                        ) : (
                          <button
                            onClick={() => handleRefundClick(order)}
                            className="px-4 py-2 rounded-md shadow-sm transition bg-red-500 text-white hover:bg-red-600"
                          >
                            Request Refund
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <h4 className="sr-only">Items</h4>
                  <ul className={`divide-y divide-gray-200 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                    {order?.orderItems?.map((itm) => (
                      <li
                        key={itm?._id}
                        className={`p-4 sm:p-6 rounded-lg shadow-md transition-all ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
                          }`}
                      >
                        {/* Product Image & Details */}
                        <div className="flex items-center sm:items-start">
                          {/* Product Image */}
                          <div className="w-20 h-20 sm:w-40 sm:h-40 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                            <img
                              alt={itm?.product?.productName}
                              src={itm?.product?.mainProductImg}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="ml-6 flex-1 text-sm">
                            <div className="font-medium sm:flex sm:justify-between">
                              <h5 className={`${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                                {itm?.product?.productName || "Unknown Product"}
                              </h5>
                              <p className={`mt-2 sm:mt-0 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                ₹{itm?.product?.price || "N/A"}
                              </p>
                            </div>
                            <p className={`hidden sm:block mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {itm?.product?.description || "No description available."}
                            </p>
                          </div>
                        </div>

                        {/* Delivery Status + Action Buttons */}
                        <div className="mt-6 sm:flex sm:justify-end items-center">
                        
                          {/* Buttons */}
                          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
                            {/* View Product */}
                            <Link
                              // href={`product/${itm?.product?._id}` || "#"}
                              //navigat on click 
                              to={`/product/${itm?.product?._id}`}
                              className={`px-4 py-2 rounded-md shadow-sm transition ${isDarkMode
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-indigo-500 text-white hover:bg-indigo-600"
                                }`}
                            >
                              View Product
                            </Link>

                            {/* Buy Again */}
                            {/* <a
                              href="/"
                              className={`px-4 py-2 rounded-md shadow-sm transition ${isDarkMode
                                ? "bg-gray-800 text-white hover:bg-gray-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                              Buy Again
                            </a> */}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                </div>

              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {selectedOrder && !showInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full sm:w-96 shadow-lg mt-36">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Request Refund for Order {selectedOrder.number}
            </h2>

            {/* Reason for Refund */}
            <label className="block mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason for Refund
            </label>
            <select
              className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={refundReason}
              onChange={(e) => {
                setRefundReason(e.target.value);
                if (e.target.value !== "Other") {
                  setRefundDescription("");
                }
              }}
            >
              <option value="">Select a reason</option>
              <option value="Damaged product">Damaged product</option>
              <option value="Wrong item received">Wrong item received</option>
              <option value="Quality not as expected">Quality not as expected</option>
              <option value="Order arrived late">Order arrived late</option>
              <option value="Other">Other</option>
            </select>

            {/* Description for 'Other' reason */}
            {refundReason === "Other" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Please describe your reason
                </label>
                <textarea
                  className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  rows="3"
                  value={refundDescription}
                  onChange={(e) => setRefundDescription(e.target.value)}
                  placeholder="Enter details here..."
                />
              </div>
            )}

            {/* Upload Image Proof (Optional) */}
            {(refundReason === "Damaged product" || refundReason === "Other") && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Image Proof (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  onChange={(e) => setRefundImage([...e.target.files])}
                />
                {refundImage?.length > 0 && (
                  <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                    {refundImage.map((file, index) => (
                      <p key={index}>{file.name} uploaded</p>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* Refund Method */}
            <label className="block mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Refund Method
            </label>
            <select
              className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={refundMethod}
              onChange={(e) => setRefundMethod(e.target.value)}
            >
              <option value="">Select refund method</option>
              <option value="Original Payment Method">Original Payment Method</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Wallet Credit">Wallet Credit</option>
            </select>

            {/* Estimated Refund Time */}
            {refundMethod && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Estimated refund time: {refundMethod === "Bank Transfer" ? "5-7 business days" : "2-3 business days"}.
              </p>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={closeRefundModal}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (refundReason === "Other" && !refundDescription.trim()) {
                    alert("Please provide a description for 'Other' reason.");
                    return;
                  }
                  processRefund(selectedOrder);
                }}
                className="text-sm font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500"
                disabled={!refundReason || !refundMethod || (refundReason === "Other" && !refundDescription.trim())}
              >
                Request Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvoice && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto mt-20">
            <Invoice order={selectedOrder} onClose={() => closeInvoice()} />

          </div>
        </div>
      )}




    </div>
  );
}
