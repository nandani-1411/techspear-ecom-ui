import React, { useRef, useContext, use, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ThemeContext } from "../Helpers/ThemeContext";
import displayINRCurrency from "../Helpers/displayCurrency";
import "../App.css"; // Ensure 'no-scrollbar' class is included
import useAddToCart from "../Helpers/addToCart";
import { useEffect } from "react";
import axios from "axios";

const HorizontalCardProduct = ({ category, heading, products =[], loading }) => {
    const [data,setData]= useState([])

    useEffect(() => {
        if (!category) return; // Agar category undefined ho to API request avoid karna
    
        const fetchData = async () => {
       
          try {
            const response = await axios.get(
              `http://localhost:5000/api/v1/products/getCategoryBasedProduct?category=${category}`
            );
    
            console.log("API Response categorywiseProd:", response.data);
            setData(response.data.data);
          } catch (error) {
            console.error("Error fetching category products:", error);
          } 
        };
    
        fetchData();
      }, [category]);
    
    const { isDarkMode } = useContext(ThemeContext);
    const scrollElement = useRef();
    const addToCart= useAddToCart()
  
    console.log("Horizontl products", products);
    // console.log("Horizontl loading", loading);

    const scrollRight = () => {
        scrollElement.current.scrollBy({ left: 400, behavior: "smooth" });
    };

    const scrollLeft = () => {
        scrollElement.current.scrollBy({ left: -400, behavior: "smooth" });
    };

    
  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
  };


    return (
        <div className={`w-full pb-8 relative ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            {/* Section Heading */}
            <div className="flex justify-between items-center px-6 md:px-10 lg:px-16 pt-5">
                <h2 className="text-2xl md:text-3xl font-bold">{heading || "Trending Products"}</h2>
            </div>

            {/* Scroll Buttons */}
            <button 
                className={`absolute top-1/2 left-2 -translate-y-1/2 z-10 p-3 rounded-full transition hidden md:flex
                    ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"}`}
                onClick={scrollLeft}
            >
                <FaAngleLeft className="w-6 h-6" />
            </button>

            <button 
                className={`absolute top-1/2 right-2 -translate-y-1/2 z-10 p-3 rounded-full transition hidden md:flex
                    ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"}`}
                onClick={scrollRight}
            >
                <FaAngleRight className="w-6 h-6" />
            </button>

            {/* Scrollable Product List */}
            <div className="relative w-full overflow-hidden mt-4">
                <div ref={scrollElement} className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar px-4 sm:px-6 md:px-10 lg:px-16">
                    {loading ? (
                        Array(4).fill(null).map((_, index) => (
                            <div
                                key={index}
                                className={`w-[220px] sm:w-[260px] md:w-[280px] h-[280px] sm:h-[320px] md:h-[350px] animate-pulse rounded-lg 
                                ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
                            ></div>
                        ))
                    ) : data.length > 0 ? (
                        data.map((product) => (
                            <Link
                                to={`/product/${product._id}`}
                                key={product._id}
                                className={`group rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 min-w-[220px] sm:min-w-[260px] md:min-w-[280px] 
                                    max-w-[220px] sm:max-w-[260px] md:max-w-[280px] flex flex-col 
                                    ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
                            >
                                {/* Product Image */}
                                <div
                                    className={`w-full h-[160px] sm:h-[180px] md:h-[200px] flex justify-center items-center relative 
                                    ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
                                >
                                    <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                                    <img
                                        src={product.mainProductImg}
                                        alt={product.productName}
                                        className="w-full h-full object-cover rounded-t-lg transition-opacity duration-700 opacity-0"
                                        onLoad={(e) => {
                                            e.target.style.opacity = 1;
                                            e.target.previousSibling.style.display = "none";
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
                                    <h2 className="font-semibold text-sm sm:text-lg truncate">{product.productName}</h2>
                                    <p className={`capitalize text-xs sm:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{product.category}</p>

                                    {/* Pricing */}
                                    <div className="flex items-center gap-2">
                                        <p className="text-red-500 font-semibold">{displayINRCurrency(product.price)}</p>
                                        <p className="text-gray-400 line-through">{displayINRCurrency(product.underlinePrice)}</p>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        className={`w-full text-xs sm:text-sm font-medium py-2 rounded-lg transition
                                            ${isDarkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                                            onClick={(e)=>handleAddToCart(e,product._id)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 w-full">No products found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HorizontalCardProduct;
