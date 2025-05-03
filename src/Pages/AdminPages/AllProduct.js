import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaTimes, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CgClose } from "react-icons/cg";
import UploadProduct from '../../Components/UploadProduct';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAllProduct, updateProduct } from '../../features/productSlice';

import productCategory from "../../Helpers/ProductCategory";
import { FaCloudUploadAlt } from "react-icons/fa";

const AllProducts = () => {
  const dispatch = useDispatch();

  const { loading, error, product } = useSelector((state) => state.product)

  const [products, setProducts] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showUploadProduct, setShowUploadProduct] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [editId, setEditId] = useState(null)


  const [data, setData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    underlinePrice: "",
    mainProductImg: null, // Change to `null` to store File object
    otherProductImg: [],
  });


  const fetchData = () => {
    dispatch(getAllProduct())
      .unwrap()
      .then((data) => {
        setProducts(data.data);
        toast.success(data?.message)
        // toast.success("Products refreshed");
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error(error || "Failed to fetch products");
      });
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  console.log('products ary stateuse', products)

  const handleEditClick = (productId) => {
    const selectedProduct = products.find((p) => p._id === productId);
    if (!selectedProduct) {
      toast.error("Product not found!");
      return;
    }

    setEditId(productId);
    setCurrentProduct(selectedProduct);
    setData({
      productName: selectedProduct.productName,
      description: selectedProduct.description,
      price: selectedProduct.price,
      category: selectedProduct.category,
      stock: selectedProduct.stock,
      underlinePrice: selectedProduct.underlinePrice,
      mainProductImg: selectedProduct.mainProductImg || null,
      otherProductImg: selectedProduct.otherProductImg || [],
    });
    setOpenEditModal(true);
  };

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

    if (!editId) {
      toast.error("Product ID is missing. Unable to update the product.");
      return;
    }

    const formData = new FormData();
    
    formData.append("productName", data.productName);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("stock", data.stock);
    formData.append("underlinePrice", data.underlinePrice);
    formData.append("isTrending", data.isTrending);

    console.log("UPDted product name ",data.productName)

    console.log("Dispatching Redux action with FormData...");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      // let tdata= {name:"nandnai",description:"learning finding er."};
      const response = await dispatch(updateProduct({ editId, formData })).unwrap();
      console.log("Updated product response:", response);
      toast.success(response?.message)

      // toast.success("Product updated successfully!");
      setOpenEditModal(false);

      dispatch(getAllProduct()); // Refresh the product list
    } catch (error) {
      console.error("Update product error:", error);
      toast.error(error || "Failed to update product.");
    }
  };


  const openModal = (images, index) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
  };
  const closeModal = () => {
    setSelectedImageIndex(null);
  };
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % selectedImages.length);
  };
  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };


  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(deleteProductId))
    setProducts((prev) => {
      console.log(prev);
      return prev.filter((product) => product._id !== deleteProductId)
    });
    toast.success('Product deleted successfully!');
    setDeleteProductId(null);
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setCurrentProduct({ ...currentProduct, images: [...currentProduct.images, ...newImages] });
  };
  const removeImage = (index) => {
    const updatedImages = currentProduct.images.filter((_, i) => i !== index);
    setCurrentProduct({ ...currentProduct, images: updatedImages });
  };

  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   product.category.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="p-4">
<div className="flex flex-wrap justify-between items-center gap-4 mb-6">
  <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
  
  <div className="flex items-center gap-3">
    <button
      onClick={() => setShowUploadProduct(true)}
      className="px-5 py-2 bg-red-600 text-white font-medium rounded-md shadow hover:bg-red-700 transition-all duration-300"
    >
      Upload Product
    </button>
  </div>

  {showUploadProduct && (
    <UploadProduct
      onClose={() => setShowUploadProduct(false)}
      fetchData={fetchData}
    />
  )}
</div>

      {/* Table with filtered products */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="p-2 border">Images</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Underline Price</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id} className="hover:bg-gray-100">
              {/* Images Column with Scroll */}
              <td className="p-2 border text-center">
                <div className="flex overflow-x-auto space-x-2 w-full h-20">
                  {/* Main Image */}
                  {prod.mainProductImg && (
                    <img
                      src={prod.mainProductImg}
                      alt="Main"
                      className="w-16 h-16 object-cover rounded border-2 border-blue-400"
                    />
                  )}

                  {/* Other Images */}
                  {prod.otherProductImg?.slice(0, 5).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Other ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </td>

              {/* Other Details */}
              <td className="p-2 border">{prod.productName}</td>
              <td className="p-2 border text-green-600 font-bold">{prod.price}</td>
              <td className="p-2 border">{prod.category}</td>
              <td className="p-2 border">
                {prod.description?.length > 40 ? `${prod.description.slice(0, 40)}...` : prod.description}
              </td>
              <td className="p-2 border line-through text-gray-500">{prod.underlinePrice}</td>

              {/* Actions */}
              <td className="p-2 border whitespace-nowrap">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleEditClick(prod._id)}
                    className="bg-blue-500 text-white p-3 w-12 h-12 flex justify-center items-center rounded-full border-none"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(prod._id)}
                    className="bg-red-500 text-white p-3 w-12 h-12 flex justify-center items-center rounded-full border-none"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setDeleteProductId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {openEditModal && currentProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-auto mt-10 mb-5 relative">
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">Edit Product</h3>

            <form className="grid p-4 gap-2 overflow-auto h-full pb-5" onSubmit={handleSubmit} encType='multipart/form-data'>
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
              <button
                type="submit"
                disabled={loading}
                className={`px-3 py-2 mb-10 text-white flex justify-center items-center ${loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Update Product"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
