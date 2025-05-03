import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MostSoldProducts = ({ products }) => {
    const [selectedProductId, setSelectedProductId] = useState(null);

    const toggleProduct = (id) => {
        setSelectedProductId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-2xl border-2 border-purple-500">
            <h3 className="text-xl font-semibold flex items-center gap-2">
                🔥 Most Sold Products
            </h3>
            <div className="mt-4 space-y-3">
                {products.map((product) => {
                    const id = product.productId?._id || product.productId; // works with ObjectId or populated
                    const isOpen = selectedProductId === id;
                    return (
                        <div
                            key={id}
                            className="p-4 bg-purple-100 rounded-lg cursor-pointer hover:bg-purple-200 transition duration-300"
                            onClick={() => toggleProduct(id)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    {product.productName }
                                </span>
                                {isOpen ? (
                                    <FaChevronUp className="text-purple-600" />
                                ) : (
                                    <FaChevronDown className="text-purple-600" />
                                )}
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                                }`}
                            >
                                <p className="text-gray-700"><strong>Description:</strong> {product.description}</p>
                                <p className="text-gray-700"><strong>Price:</strong> ₹{product.price}</p>
                                <p className="text-gray-700"><strong>Stock:</strong> {product.stock}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MostSoldProducts;
