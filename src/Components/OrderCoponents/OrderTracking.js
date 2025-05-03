import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaRegCircle, FaSearch} from "react-icons/fa";
import { ThemeContext } from "../../Helpers/ThemeContext";
import { useDispatch } from "react-redux";
import { trackingUserOrder } from "../../features/orderSlice";
import { toast } from "react-toastify";
import moment from "moment";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [statusIndex, setStatusIndex] = useState(null);
  const [statusTimeline, setStatusTimeline] = useState([]);
  const { isDarkMode } = useContext(ThemeContext);

  const bgColor = isDarkMode ? "bg-gray-700" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const inputBgColor = isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const borderColor = isDarkMode ? "border-gray-600" : "border-gray-300";

  const dispatch = useDispatch();

  const handleTrackOrder = async () => {
    if (!orderId) return;

    try {
      const res = await dispatch(trackingUserOrder({ id: orderId })).unwrap();
      console.log(res?.data);
      setStatusTimeline(res?.data?.statusTimeline || []);
      if (res?.data?.statusTimeline.length > 0) {
        setStatusIndex(res?.data?.statusTimeline.length - 1); // Set the last status as the current one
      }
    } catch (er) {
      toast.error(er);
      console.log(er);
    }
  };

  return (
    <div className={`flex flex-col items-center p-6 max-w-xl mx-auto rounded-2xl shadow-lg transition-all duration-300 ${bgColor} ${textColor}`}>
      <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>
      <div className={`flex w-full mb-6 border rounded-lg overflow-hidden transition-all ${borderColor}`}>
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className={`w-full p-3 outline-none ${inputBgColor}`}
        />
        <button
          onClick={handleTrackOrder}
          className="bg-blue-600 text-white px-4 flex items-center justify-center"
        >
          <FaSearch size={20} />
        </button>
      </div>

      {statusTimeline.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <h3 className="text-lg font-medium mb-4">Order Status:</h3>
          <div className="flex flex-col items-center gap-6">
            {statusTimeline.map((status, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all ${
                    index <= statusIndex ? "border-green-500 bg-green-100" : `${borderColor} ${bgColor}`
                  }`}
                >
                  {index <= statusIndex ? (
                    <FaCheckCircle className="text-green-500" size={24} />
                  ) : (
                    <FaRegCircle className="text-gray-400" size={24} />
                  )}
                </div>
                <div className="text-center mt-2">
                  <span className={`font-semibold ${index <= statusIndex ? textColor : "text-gray-500"}`}>
                    {status.label}
                  </span>
                  <br />
                  <span className="text-gray-500 text-sm">
                    {moment(status?.date).format("DD-MM-YYYY")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
