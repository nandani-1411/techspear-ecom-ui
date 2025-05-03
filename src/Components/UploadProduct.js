import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../Helpers/ProductCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct, uploadProduct } from "../features/productSlice";

const UploadProduct = ({ onClose, fetchData }) => {
    const { loading, product, error } = useSelector((state) => state.product)
    const [data, setData] = useState({
        productName: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        underlinePrice: "",
        mainProductImg: null, // Change to `null` to store File object
        otherProductImg: [],
        isTrending: false
    });
    const dispatch = useDispatch()
    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, mainProductImg: file }));
        }
    };

    const handleOtherImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setData((prev) => ({
            ...prev,
            otherProductImg: [...prev.otherProductImg, ...files],
        }));
    };

    const handleDeleteMainImage = () => {
        setData((prev) => ({ ...prev, mainProductImg: null }));
    };

    const handleDeleteOtherImage = (index) => {
        setData((prev) => {
            const updatedImages = [...prev.otherProductImg];
            updatedImages.splice(index, 1);
            return { ...prev, otherProductImg: updatedImages };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productName", data.productName);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category", data.category);
        formData.append("stock", data.stock);
        formData.append("underlinePrice", data.underlinePrice);
        formData.append("isTrending", data.isTrending);

        if (data.mainProductImg) {
            formData.append("mainProductImg", data.mainProductImg);
        }

        data.otherProductImg.forEach((file) => {
            formData.append("otherProductImg", file);
        });

        console.log("Dispatching Redux action with FormData...");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        dispatch(uploadProduct(formData))
            .unwrap()
            .then((data) => {
                console.log("mydt", data)
                //admin can alow msg
                toast(data)
                toast.success(data?.message);
                fetchData?.();  // If you need to refresh data after upload
                onClose();  // Close modal or reset form
            })
            .catch((error) => {
                console.error("Upload failed:", error);
                toast.error(error || "Failed to upload product.");
            });

    };


    return (
        <div className="fixed w-full h-full bg-slate-400 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
                <div className="flex justify-between items-center pb-3">
                    <h2 className="font-bold text-lg">Upload Product</h2>
                    <div className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer" onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className="grid p-4 gap-2 overflow-auto h-full pb-5" onSubmit={handleSubmit}>
                    <label htmlFor="productName">Product Name:</label>
                    <input
                        type="text"
                        id="productName"
                        placeholder="Enter product name"
                        value={data.productName}
                        onChange={(e) => setData({ ...data, productName: e.target.value })}
                        className="p-2 bg-slate-100 border rounded"
                        required
                    />

                    <label htmlFor="category" className="mt-3">Category:</label>
                    <select
                        required
                        value={data.category}
                        onChange={(e) => setData({ ...data, category: e.target.value })}
                        className="p-2 bg-slate-100 border rounded"
                    >
                        <option value="">Select Category</option>
                        {productCategory.map((el, index) => (
                            <option value={el.value} key={el.value + index}>{el.label}</option>
                        ))}
                    </select>

                    {/* ✅ Main Product Image Upload */}
                    <label className="mt-3">Main Product Image:</label>
                    <label htmlFor="uploadMainImageInput">
                        <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                            <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                                <span className="text-4xl"><FaCloudUploadAlt /></span>
                                <p className="text-sm">Upload Main Product Image</p>
                                <input type="file" id="uploadMainImageInput" className="hidden" onChange={handleMainImageUpload} />
                            </div>
                        </div>
                    </label>
                    {data.mainProductImg && (
                        <div className="relative group mt-2">
                            <img src={URL.createObjectURL(data.mainProductImg)} alt="Main Product" width={100} className="bg-slate-100 border cursor-pointer" />
                            <div
                                className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full cursor-pointer"
                                onClick={handleDeleteMainImage}
                            >
                                <CgClose className="text-lg" />
                            </div>
                        </div>
                    )}

                    {/* ✅ Other Product Images Upload */}
                    <label className="mt-3">Other Product Images:</label>
                    <label htmlFor="uploadOtherImagesInput">
                        <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                            <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                                <span className="text-4xl"><FaCloudUploadAlt /></span>
                                <p className="text-sm">Upload Other Product Images</p>
                                <input type="file" id="uploadOtherImagesInput" className="hidden" onChange={handleOtherImagesUpload} multiple />
                            </div>
                        </div>
                    </label>
                    <div className="flex gap-2 flex-wrap mt-2">
                        {data.otherProductImg.map((img, index) => (
                            <div className="relative group" key={index}>
                                <img src={URL.createObjectURL(img)} alt="Other Product" width={80} height={80} className="bg-slate-100 border cursor-pointer" />
                                <div
                                    className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full cursor-pointer"
                                    onClick={() => handleDeleteOtherImage(index)}
                                >
                                    <CgClose className="text-lg" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <label htmlFor="price" className="mt-3">Price:</label>
                    <input
                        type="number"
                        id="price"
                        placeholder="Enter price"
                        value={data.price}
                        onChange={(e) => setData({ ...data, price: e.target.value })}
                        className="p-2 bg-slate-100 border rounded"
                        required
                    />

                    <label htmlFor="underlinePrice" className="mt-3">Underline Price:</label>
                    <input
                        type="number"
                        id="underlinePrice"
                        placeholder="Enter underline price"
                        value={data.underlinePrice}
                        onChange={(e) => setData({ ...data, underlinePrice: e.target.value })}
                        className="p-2 bg-slate-100 border rounded"
                        required
                    />

                    <label htmlFor="stock" className="mt-3">Stock:</label>
                    <input
                        type="number"
                        id="stock"
                        placeholder="Enter stock quantity"
                        value={data.stock}
                        onChange={(e) => setData({ ...data, stock: e.target.value })}
                        className="p-2 bg-slate-100 border rounded"
                        required
                    />

                    <label htmlFor="description" className="mt-3">Product Description:</label>
                    <textarea
                        id="description"
                        placeholder="Enter product description"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        className="p-2 bg-slate-100 border rounded resize-none h-24"
                        required
                    ></textarea>

                    <div className="flex justify-center items-center gap-6 mt-3 mb-3">
                        <label htmlFor="isTrending" className="text-rose-950">Is Trending? Product?</label>
                        <input
                            type="checkbox"
                            id="isTrending"
                            value={data.isTrending}
                            onChange={(e) => setData({ ...data, isTrending: e.target.checked })} 
                            className=" bg-slate-600 border rounded" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-3 py-2 mb-10 text-white flex justify-center items-center ${loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Upload Product"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadProduct;
