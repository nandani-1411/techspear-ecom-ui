import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createReview } from "../features/reviewSlice";
import { useContext } from "react";
import { ThemeContext } from "../Helpers/ThemeContext"; // Assuming ThemeContext is in this path

export default function ReviewPage() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setReview] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDarkMode } = useContext(ThemeContext);

    const location = useLocation();
    const userId = location.state?.userId;
    const productId = location.state?.productId;

    const handleSubmit = async () => {
        if (!rating) {
            toast.error("Please select a rating.");
            return;
        }
        if (comment.trim().length < 10) {
            toast.error("Review must be at least 10 characters.");
            return;
        }
    
        try {
            const response = await dispatch(createReview({ userId, productId, rating, comment })).unwrap();
            toast.success(response?.message);
    
            // Redirect to the order-history page after successful review submission
            navigate("/user-panel/order-manage");
        } catch (er) {
            console.log(er);
            toast.error(er);
        }
    };
    

    return (
        <div
            className={`max-w-2xl mx-auto mt-10 p-6 rounded-lg shadow-lg transition duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
        >
            <h2 className="text-2xl font-semibold text-center mb-4">Write a Review</h2>

            <p className="text-center mb-4">
                Share your experience with us!
            </p>

            {/* Star Rating */}
            <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <FaStar
                            key={index}
                            className={`w-8 h-8 cursor-pointer transition ${starValue <= (hover || rating) ? "text-yellow-500" : "text-gray-300"
                                }`}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(0)}
                        />
                    );
                })}
            </div>

            {/* Review Text Area */}
            <textarea
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setReview(e.target.value)}
                className={`w-full p-3 border rounded-lg mb-4 transition duration-300 ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
                    }`}
                rows="5"
            ></textarea>
            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300 bg-indigo-600 text-white hover:bg-indigo-700"
            >
                Submit Review
            </button>

        </div>
    );
}
