import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../Helpers/ThemeContext";

const CategoryList = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch categories from backend
  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/products/getAllCategoryName", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json();
        setCategories(result.data || []);
        console.log(categories)
      } catch (error) {
        if (error.name !== "AbortError") console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, []);

  return (
    <div className="xl:container mx-auto p-4">
      <div className="scroll-container flex items-center gap-4 justify-between overflow-x-auto">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 w-16 md:w-20 md:h-20 rounded-full bg-slate-300 animate-pulse"></div>
            ))
          : categories.map((category) => (
              <Link
                key={category._id}
                to={`/product-category?category=${category._id}`}
                className="flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18 rounded-full overflow-hidden p-1 bg-gray-200 flex items-center justify-center">
                  <img
                    src={category.mainProductImg || "https://via.placeholder.com/150"}
                    alt={category._id}
                    className="h-full w-full object-cover rounded-full hover:scale-110 transition-transform"
                  />
                </div>
                <p className={`mt-2 text-sm md:text-base capitalize ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {category._id}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default CategoryList;
