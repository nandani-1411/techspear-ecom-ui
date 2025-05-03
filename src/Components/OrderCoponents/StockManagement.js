import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllProduct, stockManagement } from "../../features/productSlice";
import { toast } from "react-toastify";

const StockManagement = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ id: "", name: "", stock: "" });
    const [stockFilter, setStockFilter] = useState("All");

    const dispatch = useDispatch();

    const showProduct = async () => {
        try {
            const res = await dispatch(getAllProduct()).unwrap();
            toast.success(res?.message);
            setProducts(res?.data);
        } catch (er) {
            toast.error(er);
        }
    };

    useEffect(() => {
        showProduct();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedProduct = { ...newProduct, [name]: value };

        if (name === "id") {
            const existingProduct = products.find((p) => p._id === value);
            updatedProduct.name = existingProduct ? existingProduct.productName : "";
        }

        setNewProduct(updatedProduct);
    };

    const addOrUpdateProduct = async () => {
        if (!newProduct.id || !newProduct.stock || isNaN(newProduct.stock)) {
            toast.error("Please provide valid product ID and stock value.");
            return;
        }

        const existingProduct = products.find((p) => p._id === newProduct.id);
        if (!existingProduct) {
            toast.error("Product not found.");
            return;
        }

        const finalStock = existingProduct.stock + Number(newProduct.stock);

        try {
            const res = await dispatch(
                stockManagement({
                    productId: newProduct.id,
                    stock: finalStock,
                })
            ).unwrap();

            toast.success(res?.message || "Stock updated successfully");
            showProduct(); // Refresh the list
        } catch (er) {
            toast.error(er?.message || "Something went wrong while updating stock");
        }

        setNewProduct({ id: "", name: "", stock: "" });
    };

    const filteredProducts = products.filter((p) => {
        if (stockFilter === "All") return true;
        if (stockFilter === "Less than 15") return p.stock < 15;
        if (stockFilter === "15 to 50") return p.stock >= 15 && p.stock <= 50;
        if (stockFilter === "50 to 100") return p.stock > 50 && p.stock <= 100;
        if (stockFilter === "More than 100") return p.stock > 100;
        return true;
    });

    const handleRowClick = (product) => {
        setNewProduct({
            id: product._id,
            name: product.productName,
            stock: ""
        });
    };

    return (
        <div className="p-5 bg-gray-50 rounded-lg shadow-md w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Stock Management</h2>

            {/* Input Fields */}
            <div className="mb-4 flex flex-wrap gap-2">
                <input
                    type="text"
                    name="id"
                    value={newProduct.id}
                    placeholder="Product ID"
                    onChange={handleChange}
                    className="border p-2 rounded-md flex-1 min-w-[150px]"
                />
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    placeholder="Product Name (Auto-fill if exists)"
                    onChange={handleChange}
                    className="border p-2 rounded-md flex-1 min-w-[150px]"
                />
                <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    placeholder="Stock"
                    onChange={handleChange}
                    className="border p-2 rounded-md flex-1 min-w-[150px]"
                />
                <button
                    onClick={addOrUpdateProduct}
                    className="border px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition min-w-[120px]"
                >
                    Add/Update
                </button>
            </div>

            {/* Filter Dropdown */}
            <div className="flex justify-end mb-3">
                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="border p-2 rounded-md bg-white text-gray-700"
                >
                    <option value="All">All</option>
                    <option value="Less than 15">Less than 15</option>
                    <option value="15 to 50">15 to 50</option>
                    <option value="50 to 100">50 to 100</option>
                    <option value="More than 100">More than 100</option>
                </select>
            </div>

            {/* Stock Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border bg-white shadow-md rounded-lg text-sm">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Product</th>
                            <th className="p-3 text-left">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <tr
                                    key={product._id}
                                    onClick={() => handleRowClick(product)}
                                    className={`border-t cursor-pointer transition ${
                                        product._id === newProduct.id
                                            ? "bg-blue-100"
                                            : index % 2 === 0
                                            ? "bg-gray-100"
                                            : "bg-white"
                                    } hover:bg-blue-50`}
                                >
                                    <td className="p-3 whitespace-nowrap">{product._id}</td>
                                    <td className="p-3 whitespace-nowrap">{product.productName}</td>
                                    <td
                                        className={`p-3 whitespace-nowrap ${
                                            product.stock < 5
                                                ? "text-red-600 font-bold"
                                                : product.stock <= 20
                                                ? "text-yellow-500 font-medium"
                                                : product.stock <= 30
                                                ? "text-orange-500 font-medium"
                                                : "text-green-600 font-bold"
                                        }`}
                                    >
                                        {product.stock}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center p-4 text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockManagement;
