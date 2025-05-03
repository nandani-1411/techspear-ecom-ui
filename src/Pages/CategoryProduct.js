import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../Helpers/ProductCategory";
import VerticalCard from "../Components/VerticalCardProduct";
import { ThemeContext } from "../Helpers/ThemeContext";
import { HiFilter } from "react-icons/hi";
import axios from "axios";

const CategoryProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode } = useContext(ThemeContext);

    const urlSearch = new URLSearchParams(location.search);
    const urlCategoryList = urlSearch.getAll("category");

    const [selectCategory, setSelectCategory] = useState(
        urlCategoryList.reduce((acc, el) => ({ ...acc, [el]: true }), {})
    );
    const [filterCategoryList, setFilterCategoryList] = useState(urlCategoryList);
    const [sortBy, setSortBy] = useState("");
    const [data, setData] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:5000/api/v1/products/filterProduct`,
                    {
                        categoryList: filterCategoryList,
                        sortOption:
                            sortBy === "asc"
                                ? "LowToHigh"
                                : sortBy === "dsc"
                                    ? "HighToLow"
                                    : "",
                    },
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setData(response.data.data);
            } catch (error) {
                console.error("Error filtering products:", error);
                setData([]);
            }
        };

        if (filterCategoryList.length) {
            fetchFilteredProducts();
        }
    }, [filterCategoryList, sortBy]);

    useEffect(() => {
        const selectedCategories = Object.keys(selectCategory).filter((key) => selectCategory[key]);
        setFilterCategoryList(selectedCategories);

        // Update the URL without reloading
        navigate(`/product-category?${selectedCategories.map((cat) => `category=${cat}`).join("&")}`);
    }, [selectCategory, navigate]);

    return (
        <div className={`mx-auto p-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            <div className="flex justify-between items-center mb-4">
                <button
                    className="lg:hidden bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    onClick={() => setShowFilters(true)}
                >
                    <HiFilter size={20} /> Filters
                </button>
                <select
                    className={`border px-3 py-2 rounded-md text-sm ${isDarkMode
                        ? "bg-gray-800 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                        }`}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="">Sort By</option>
                    <option value="asc">Price - Low to High</option>
                    <option value="dsc">Price - High to Low</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[250px,1fr]">
                <div
                    className={`
        p-4 border rounded-md
        fixed left-0 h-full w-[80%] max-w-[300px] z-50 shadow-lg pt-16
        ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}
        ${showFilters ? "translate-x-0 top-[60px]" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:w-full lg:pt-0
        lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] lg:overflow-y-auto
    `}
                >

                    {showFilters && (
                        <div className="flex justify-between items-center lg:hidden">
                            <h3 className="text-lg font-semibold mb-2">Filters</h3>
                            <button className="text-red-500 text-xl font-bold" onClick={() => setShowFilters(false)}>
                                ✖
                            </button>
                        </div>
                    )}
                    <div>
                        <h3
                            className={`text-base uppercase font-medium pb-1 border-b ${isDarkMode ? "text-gray-300 border-gray-500" : "text-gray-600 border-gray-300"
                                }`}
                        >
                            Category
                        </h3>
                        <form className="text-sm flex flex-col gap-2 py-2">
                            {productCategory.map((category, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="category"
                                        checked={selectCategory[category.value] || false}
                                        value={category.value}
                                        id={category.value}
                                        onChange={(e) => {
                                            setSelectCategory((prev) => ({
                                                ...prev,
                                                [e.target.value]: e.target.checked,
                                            }));
                                        }}
                                    />
                                    <label htmlFor={category.value}>{category.label}</label>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>

                <div className="lg:pl-4 max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
                    <p className="font-medium text-lg my-2">Search Results: {data?.length}</p>
                    <div className="mx-4 lg:mx-0">
                        <div className="w-full flex gap-4 flex-wrap">
                            {data.length !== 0 ? (
                                <VerticalCard data={data} className="w-full h-auto" />
                            ) : (
                                <p>No products found.</p>
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default CategoryProduct;