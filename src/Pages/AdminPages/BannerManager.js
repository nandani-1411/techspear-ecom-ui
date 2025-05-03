import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBanner, getAllBanners, deleteBanner } from "../../features/bannerSlice";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";

const BannerManager = () => {
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [banners, setBanners] = useState([]);
  const { loading } = useSelector((state) => state.banner);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await dispatch(getAllBanners()).unwrap();
      setBanners(data.data);
      toast.success(data?.message);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return toast.warning("Please select at least one image");
    }

    try {
      for (let file of selectedFiles) {
        const formData = new FormData();
        formData.append("img", file);
        const banner = await dispatch(addBanner(formData)).unwrap();
        toast.success(banner?.message);
      }

      setSelectedFiles([]);
      fileInputRef.current.value = null;
      fetchBanners();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteBanner(id)).unwrap();
      toast.success(response?.message || "Banner deleted");
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">🎯 Manage Banners</h2>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-blue-400 cursor-pointer p-6 rounded-lg text-center hover:bg-blue-50 transition"
        >
          <FaCloudUploadAlt className="mx-auto text-5xl text-blue-600 mb-2" />
          <p className="text-blue-700 font-semibold">Click or drag to upload banners</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Image Previews */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {selectedFiles.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded shadow border"
              />
            ))}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-4 px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Banner List */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-9 ">Uploaded Banners</h3>
        {loading ? (
          <p className="text-gray-500">Loading banners...</p>
        ) : banners.length === 0 ? (
          <p className="text-gray-500 italic">No banners uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="relative bg-white rounded-lg overflow-hidden shadow-md group"
              >
                <img
                  src={banner.img}
                  alt="banner"
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow"
                >
                  <MdDelete className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManager;
