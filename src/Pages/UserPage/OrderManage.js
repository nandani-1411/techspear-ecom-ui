import { useState, useContext } from "react";
import { FaArrowLeft, FaShippingFast } from "react-icons/fa";
import OrderList from "../../Components/OrderCoponents/OrderList";
import OrderTracking from "../../Components/OrderCoponents/OrderTracking";
import { ThemeContext } from "../../Helpers/ThemeContext"; // Ensure correct import

export default function OrderHistoryPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [showTracking, setShowTracking] = useState(false);
  const [orders, setOrders] = useState([
    // Sample order data
    {
      number: "WU88191111",
      status: "Delivered", // Initially delivered
      date: "March 10, 2025",
      amount: "$999",
    },
    {
      number: "WU88192222",
      status: "Processing",
      date: "March 12, 2025",
      amount: "$799",
    },
  ]);

  const handleRefundRequest = (orderNumber) => {
    const updatedOrders = orders.map((order) =>
      order.number === orderNumber ? { ...order, status: "Refunded" } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div
      className={`md:p-12  min-h-screen transition-all ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-slate-200 text-black"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-6 m-3">
        <button
          className="flex items-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-md transition duration-300
                     bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 sm:w-auto text-white"
          onClick={() => setShowTracking(!showTracking)}
        >
          {showTracking ? <FaArrowLeft /> : <FaShippingFast />}
          {showTracking ? "Back to Order History" : "Track Your Order"}
        </button>
      </div>

      {/* Conditional Rendering with Smooth Transition */}
      <div className={`transition-opacity duration-500 ${showTracking ? "opacity-100" : "opacity-100"}`}>
        {showTracking ? (
          <OrderTracking />
        ) : (
          <OrderList orders={orders} onRefundRequest={handleRefundRequest} />
        )}
      </div>
    </div>
  );
}
