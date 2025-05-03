import { useState } from "react";
import { FaCheck, FaTimesCircle, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const RefundRequests = () => {
  const [refunds, setRefunds] = useState([
    {
      userName: "John Doe",
      orderId: "12345",
      reason: "Defective Product",
      description: "The laptop screen has dead pixels.",
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
      status: null,
      timestamp: null,
    },
    {
      userName: "Jane Smith",
      orderId: "67890",
      reason: "Wrong Item Received",
      description: "I ordered a gaming PC but received a standard desktop.",
      images: ["https://via.placeholder.com/150"],
      status: null,
      timestamp: null,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAccept = (orderId) => {
    updateRefundStatus(orderId, "Accepted");
  };

  const handleReject = (orderId) => {
    updateRefundStatus(orderId, "Rejected");
  };

  const updateRefundStatus = (orderId, status) => {
    setRefunds((prevRefunds) =>
      prevRefunds.map((refund) =>
        refund.orderId === orderId
          ? { ...refund, status, timestamp: new Date().toLocaleString() }
          : refund
      )
    );
  };

  const openModal = (images, index) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < selectedImages.length - 1 ? prev + 1 : prev
    );
  };

  const filteredRefunds = refunds.filter((refund) =>
    Object.values(refund)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
  const displayedRefunds = filteredRefunds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl mb-4">Refund Requests</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search refund requests..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 mb-6">
          <thead className="bg-slate-900 text-white sticky top-0">
            <tr>
              <th className="p-2 border">User Name</th>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {displayedRefunds.map((refund, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2 border">{refund.userName}</td>
                <td className="p-2 border">{refund.orderId}</td>
                <td className="p-2 border">{refund.reason}</td>
                <td className="p-2 border">{refund.description}</td>
                <td className="p-2 border text-center">
                  <div className="flex overflow-x-auto space-x-2 w-40 max-w-full">
                    {refund.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="refund"
                        className="w-16 h-16 object-cover rounded cursor-pointer shrink-0"
                        onClick={() => openModal(refund.images, i)}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-2 border text-center">
                  {refund.status ? (
                    <span
                      className={`font-semibold ${
                        refund.status === "Accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {refund.status}
                    </span>
                  ) : (
                    <div className="flex space-x-2 justify-center">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 hidden xl:inline-block"
                        onClick={() => handleAccept(refund.orderId)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 hidden xl:inline-block"
                        onClick={() => handleReject(refund.orderId)}
                      >
                        Reject
                      </button>

                      {/* Icons for mobile */}
                      <button
                        className="text-green-600 xl:hidden"
                        onClick={() => handleAccept(refund.orderId)}
                      >
                        <FaCheck size={20} />
                      </button>
                      <button
                        className="text-red-600 xl:hidden"
                        onClick={() => handleReject(refund.orderId)}
                      >
                        <FaTimesCircle size={20} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-2 border">{refund.timestamp || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Full-Screen Image Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <button
            className="absolute top-5 right-5 bg-gray-800 text-white p-2 rounded-full"
            onClick={closeModal}
          >
            <FaTimes size={24} />
          </button>
          <button
            className="absolute left-5 bg-gray-800 text-white p-3 rounded-full"
            onClick={prevImage}
          >
            <FaArrowLeft size={24} />
          </button>
          <img
            src={selectedImages[selectedImageIndex]}
            alt="Refund"
            className="max-w-[90%] max-h-[90vh] rounded-lg shadow-lg"
          />
          <button
            className="absolute right-5 bg-gray-800 text-white p-3 rounded-full"
            onClick={nextImage}
          >
            <FaArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RefundRequests;
