import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import displayINRCurrency from '../Helpers/displayCurrency';
import scrollTop from '../Helpers/scrollTop';
import axios from 'axios';
import useAddToCart from '../Helpers/addToCart';
import { ThemeContext } from '../Helpers/ThemeContext'; // ✅ import ThemeContext

const CategroyWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const addToCart = useAddToCart();
  const { isDarkMode } = useContext(ThemeContext); // ✅ get theme state

  useEffect(() => {
    if (!category) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/products/getCategoryBasedProduct?category=${category}`
        );
        console.log("API Response categorywiseProd:", response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
  };

  return (
    <div className={`container mx-auto px-4 my-6 relative ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      {/*Loading Indicator */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
          {data.length > 0 ? (
            data.map((product) => (
              <Link
                to={`/product/${product._id}`}
                className={`w-full rounded-sm shadow transition-all duration-300
                  ${isDarkMode ? "bg-gray-800 hover:shadow-gray-600" : "bg-white hover:shadow-md"}`}
                onClick={scrollTop}
                key={product._id}
              >
                <div className={`h-48 p-4 flex justify-center items-center ${isDarkMode ? "bg-gray-700" : "bg-slate-200"}`}>
                  <img
                    src={product.mainProductImg}
                    alt={product.productName}
                    className="object-scale-down h-full hover:scale-110 transition-transform"
                  />
                </div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base md:text-lg">
                    {product.productName}
                  </h2>
                  <p className="capitalize text-slate-400">{product.category}</p>
                  <div className="flex gap-3">
                    <p className="text-red-500 font-medium">
                      {displayINRCurrency(product.price)}
                    </p>
                    <p className="text-slate-500 line-through">
                      {displayINRCurrency(product.underlinePrice)}
                    </p>
                  </div>
                  <button
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
                    onClick={(e) => handleAddToCart(e, product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategroyWiseProductDisplay;
