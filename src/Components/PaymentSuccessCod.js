import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, Outlet } from "react-router-dom";
import successSound from "./success.mp3"; // ✅ import sound
import { useLocation } from "react-router-dom";

export default function PaymentSuccessCod() {
    const navigate = useNavigate();
    const location = useLocation();

    const userId= location.state?.userId;
    const productId = location.state?.productId;


console.log("paymet success user id ",userId);
console.log("paymet success product id ",productId);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        const audio = new Audio(successSound);
        audio.play();
    }, []);

    const handleWriteReview = () => {
        setShowReviewModal(true);
        navigate("/payment-success/write-review",{
            state:{
                userId:userId,
                productId:productId
            }
        });
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-2xl rounded-3xl p-10 text-center max-w-lg w-full mx-auto mt-20"
        >

            <p className="mt-6 text-lg">
                Would you like to share your experience?
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg font-semibold text-lg shadow-md"
                onClick={handleWriteReview}
            >
                Write a Review
            </motion.button>

            {showReviewModal && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 pt-24 sm:pt-32"
                >
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative text-gray-900 dark:text-gray-100">
                        <button
                            className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                            onClick={() => setShowReviewModal(false)}
                        >
                            ✖
                        </button>
                        <Outlet context={{ userId, productId }} />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
