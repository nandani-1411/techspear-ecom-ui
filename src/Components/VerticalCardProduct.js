import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../Helpers/ThemeContext";
import useAddToCart from "../Helpers/addToCart";
import displayINRCurrency from "../Helpers/displayCurrency";

export default function ProductGrid({ data, className }) {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} py-16 w-full h-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.length === 0 ? (
            <p className="text-center text-lg font-semibold">No products found.</p>
          ) : (
            data.map((product) => (
              <div
                key={product._id}
                className={`flex flex-col rounded-lg overflow-hidden transform hover:scale-105 transition cursor-pointer shadow-lg 
              ${isDarkMode ? "bg-gray-800 text-white hover:shadow-gray-700" : "bg-white text-gray-900 hover:shadow-md"}`}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Image */}
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={product.mainProductImg}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold">{product.productName}</h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {product.category}
                  </p>
                  <p className="text-lg font-bold mt-2">{ displayINRCurrency(product.price)}</p>
                </div>

                {/* Button */}
                <div className="p-5">
                  <button
                    className={`w-full py-2 text-lg font-medium rounded-lg transition 
                  ${isDarkMode ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(e, product._id);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

  );
}
